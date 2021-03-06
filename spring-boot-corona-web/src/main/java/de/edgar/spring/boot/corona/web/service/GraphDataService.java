package de.edgar.spring.boot.corona.web.service;

import java.awt.Color;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import de.edgar.spring.boot.corona.web.cache.CoronaDataCache;
import de.edgar.spring.boot.corona.web.config.ColorProperties;
import de.edgar.spring.boot.corona.web.config.ColorProperty;
import de.edgar.spring.boot.corona.web.jpa.CoronaDataEntity;
import de.edgar.spring.boot.corona.web.jpa.CoronaDataJpaRepository;
import de.edgar.spring.boot.corona.web.model.CoronaData;
import de.edgar.spring.boot.corona.web.model.CoronaDataSession;
import de.edgar.spring.boot.corona.web.model.charts.BarChartData;
import de.edgar.spring.boot.corona.web.model.charts.BarSeries;
import de.edgar.spring.boot.corona.web.model.charts.Bubble;
import de.edgar.spring.boot.corona.web.model.charts.BubbleChartData;
import de.edgar.spring.boot.corona.web.model.charts.BubbleSeries;
import de.edgar.spring.boot.corona.web.model.charts.LineChartData;
import de.edgar.spring.boot.corona.web.model.charts.Series;
import de.edgar.spring.boot.corona.web.model.charts.StackedAreaChartData;
import de.edgar.spring.boot.corona.web.model.charts.StackedAreaSeries;
import de.edgar.spring.boot.corona.web.model.charts.StackedBarChartData;
import de.edgar.spring.boot.corona.web.model.charts.StackedBarSeries;
import de.edgar.spring.boot.corona.web.model.charts.XAxis;
import de.edgar.spring.boot.corona.web.model.charts.YAxis;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class GraphDataService {

	@Value( "${corona.data.daysToKum}" )
	private Integer daysToKum;

	@Value( "${corona.data.daysToKumPop}" )
	private Long daysToKumPop;

	@Autowired
	private CoronaDataJpaRepository repo;
	
	@Autowired
	private ColorProperties colorProps;
	
	@Autowired
	private CoronaDataCache cache;

	@Autowired
	private MessageSourceService messageSourceService;
	
	@Autowired
	private GraphDataAsyncService asyncService;
	
	private long getLong(Long value) {
		return getLong(value, 0L);
	}

	private double getDouble(Double value) {
		return getDouble(value, 0.0);
	}

	private double getDouble(Long value) {
		return getDouble(value, 0.0);
	}

	private long getLong(Long value, Long defaultValue) {
		return value != null ? value.longValue() : defaultValue;
	}

	private double getDouble(Double value, Double defaultValue) {
		return value != null ? value.doubleValue() : defaultValue;
	}

	private double getDouble(Long value, Double defaultValue) {
		return value != null ? value.doubleValue() : defaultValue;
	}


    public LineChartData getLineGraphData(CoronaDataSession cds) {
    	LineChartData data = new LineChartData();

    	String title = getTitleBySelectedData(cds);
    	
    	data.setTitle(messageSourceService.getMessage("chart.historical", cds.getLocale()));
    	data.setSubTitle(title);
    	
    	YAxis yAxis = new YAxis();
    	yAxis.setTitle(title);
    	yAxis.setType(cds.getSelectedYAxisType());
    	data.setYAxis(yAxis);
    	
    	Map<String,List<CoronaData>> territoryMap = new HashMap<>();
		if (!CollectionUtils.isEmpty(cds.getSelectedTerritories())) {
			territoryMap.putAll(getHistoricalData(cds));
		}

    	XAxis xAxis = getXAxisWithDates(cds);
    	data.setXAxis(xAxis);
    	
    	Iterator<ColorProperty> colorIterator = colorProps.getColors().iterator();

    	List<Series> series = new ArrayList<>();
		territoryMap.keySet().forEach(t -> {
	    	Series s = new Series();
	    	String name = cache.getTerritoryName(t, cds.getLocale());
	    	s.setName(name);
			String color = colorIterator.hasNext() ? colorIterator.next().getHexRGB() : "";
	    	s.setColor(color);
	    	s.setData(new ArrayList<>());
	    	Map<String, Double> valueMap = new HashMap<>();
	    	territoryMap.get(t).forEach(d -> {
				log.debug(d.toString());
				double value = getValueBySelectedData(cds, d);
	    		if (!cds.getSelectedDataCategory().startsWith("perDay")) {
			    	if (value == 0.0) {
			    		value = getDouble(valueMap.get("last"));
			    	} else {
			    		valueMap.put("last", value);
			    	}
	    		}
		    	if ("logarithmic".equals(yAxis.getType()) && value < 0.0001) {
		    		value = 0.0001;
		    	}
	    		s.getData().add(value);
	    		
		    	if ("linear".equals(yAxis.getType())) {
		    		yAxis.setMin(0.0);
		    	} else {
		    		if (yAxis.getMin() == null) {
		    			yAxis.setMin(1.0);
		    		}
		    		
		    		if (yAxis.getMin() > value && value > 0.0) {
		    			yAxis.setMin(value);
		    		}
		    	}
	    	});
	    	series.add(s);
		});
    	data.setSeries(series);
    	
    	
        return data;
    }

    public BubbleChartData getBubbleGraphData(CoronaDataSession cds) {
    	BubbleChartData data = new BubbleChartData();

    	String title = getTitleBySelectedData(cds);
    	
    	data.setTitle(messageSourceService.getMessage("chart.historicalBubbles", cds.getLocale()));
    	data.setSubTitle(title);
    	
    	YAxis yAxis = new YAxis();
    	yAxis.setTitle(title);
    	yAxis.setType(cds.getSelectedYAxisType());
    	data.setYAxis(yAxis);
    	
    	Map<String,List<CoronaData>> territoryMap = new HashMap<>();
		if (!CollectionUtils.isEmpty(cds.getSelectedTerritories())) {
			territoryMap.putAll(getHistoricalData(cds));
		}

    	XAxis xAxis = new XAxis();
    	xAxis.setTitle(messageSourceService.getMessage("date", cds.getLocale()));
    	List<String> dates = new ArrayList<>();
    	
        for (LocalDate date = cds.getFromDate(); date.isBefore(cds.getToDate().plusDays(1)); date=date.plusDays(1)) {
        	dates.add(date.format(DateTimeFormatter.ofPattern("dd.MM.")));
        }
    	log.debug("Dates: " + dates);
    	xAxis.setDates(dates);
    	data.setXAxis(xAxis);
    	
    	Iterator<ColorProperty> colorIterator = colorProps.getColors().iterator();

    	List<BubbleSeries> series = new ArrayList<>();
		territoryMap.keySet().forEach(t -> {
			BubbleSeries s = new BubbleSeries();
			s.setName(cache.getTerritoryName(t, cds.getLocale()));
			String color = colorIterator.hasNext() ? colorIterator.next().getHexRGB() : "";
	    	s.setColor(color);
	    	s.setData(new ArrayList<>());
	    	AtomicInteger x = new AtomicInteger();
	    	territoryMap.get(t).forEach(d -> {
				log.debug(d.toString());
				Double y;
				Double z;
				switch (cds.getSelectedDataType() + "-" + cds.getSelectedDataCategory()) {
				default:
				case "infections-cumulated":
					y = getDouble(d.getCasesKum());
					z = getDouble(d.getCases());
					break;
				case "infections-perDay":
					y = getDouble(d.getCases());
					z = getDouble(d.getCases());
					break;
				case "infections-per100000":
					y = getDouble(d.getCasesPer100000Pop());
					z = getDouble(d.getCases());
					break;
				case "infections-perDaysAnd100000":
					y = getDouble(d.getCasesDaysPer100000Pop());
					z = getDouble(d.getCases());
					break;
				case "deaths-cumulated":
					y = getDouble(d.getDeathsKum());
					z = getDouble(d.getDeaths());
					break;
				case "deaths-perDay":
					y = getDouble(d.getDeaths());
					z = getDouble(d.getDeaths());
					break;
				case "deaths-per100000":
					y = getDouble(d.getDeathsPer100000Pop());
					z = getDouble(d.getDeaths());
					break;
				case "deaths-perDaysAnd100000":
					y = getDouble(d.getDeathsDaysPer100000Pop());
					z = getDouble(d.getDeaths());
					break;
				case "recovered-cumulated":
					y = getDouble(d.getRecoveredKum());
					z = getDouble(d.getRecovered());
					break;
				case "recovered-perDay":
					y = getDouble(d.getRecovered());
					z = getDouble(d.getRecovered());
					break;
				case "recovered-per100000":
					y = getDouble(d.getRecoveredPer100000Pop());
					z = getDouble(d.getRecovered());
					break;
				case "recovered-perDaysAnd100000":
					y = getDouble(d.getRecoveredDaysPer100000Pop());
					z = getDouble(d.getRecovered());
					break;
				case "active-cumulated":
					y = getDouble(d.getActiveKum());
					z = getDouble(d.getActive());
					break;
				case "active-perDay":
					y = getDouble(d.getActive());
					z = getDouble(d.getActive());
					break;
				case "active-per100000":
					y = getDouble(d.getActivePer100000Pop());
					z = getDouble(d.getActive());
					break;
				case "active-perDaysAnd100000":
					y = getDouble(d.getActiveDaysPer100000Pop());
					z = getDouble(d.getActive());
					break;
				case "vaccinationFirst-cumulated":
					y = getDouble(d.getFirstVaccinationsKum());
					z = getDouble(d.getFirstVaccinations());
					break;
				case "vaccinationFirst-perDay":
					y = getDouble(d.getFirstVaccinations());
					z = getDouble(d.getFirstVaccinations());
					break;
				case "vaccinationFirst-per100000":
					y = getDouble(d.getFirstVaccinationsPer100000Pop());
					z = getDouble(d.getFirstVaccinations());
					break;
				case "vaccinationFull-cumulated":
					y = getDouble(d.getFullVaccinationsKum());
					z = getDouble(d.getFullVaccinations());
					break;
				case "vaccinationFull-perDay":
					y = getDouble(d.getFullVaccinations());
					z = getDouble(d.getFullVaccinations());
					break;
				case "vaccinationFull-per100000":
					y = getDouble(d.getFullVaccinationsPer100000Pop());
					z = getDouble(d.getFullVaccinations());
					break;
				case "vaccinationTotal-cumulated":
					y = getDouble(d.getTotalVaccinationsKum());
					z = getDouble(d.getTotalVaccinations());
					break;
				case "vaccinationTotal-perDay":
					y = getDouble(d.getTotalVaccinations());
					z = getDouble(d.getTotalVaccinations());
					break;
				case "vaccinationTotal-per100000":
					y = getDouble(d.getTotalVaccinationsPer100000Pop());
					z = getDouble(d.getTotalVaccinations());
					break;
				}
	    		if ("percentage".equals(cds.getSelectedYAxisType())) {
	    			y = y * 100.0 / d.getPopulation();
	    			z = z * 100.0 / d.getPopulation();
	    		}
				if (y < 0.0) {
					y = 0.0;
				}
				if (z < 0.0) {
					z = 0.0;
				}
				Bubble bubble = new Bubble(x.get(), y, z, cache.getTerritoryName(t, cds.getLocale()), dates.get(x.get()));
				s.getData().add(bubble);
				x.incrementAndGet();
	    		
		    	if ("linear".equals(yAxis.getType()) || "percentage".equals(yAxis.getType())) {
		    		yAxis.setMin(0.0);
		    	} else {
		    		if (yAxis.getMin() == null) {
		    			yAxis.setMin(1.0);
		    		}
		    		
		    		if (yAxis.getMin() > y && y > 0.0) {
		    			yAxis.setMin(y);
		    		}
		    	}
	    	});
	    	series.add(s);
		});
    	data.setSeries(series);
    	
        return data;
    }
    
    public BarChartData getBarGraphData(CoronaDataSession cds) {
    	BarChartData data = new BarChartData();
    	
		LocalDate selectedDate = cds.getToDate();
		
		List<CoronaData> coronaData = new ArrayList<>();
		if (!CollectionUtils.isEmpty(cds.getSelectedTerritories())) {
			switch (cds.getSelectedDataCategory()) {
			case "perDaysAnd100000":
				LocalDate today = LocalDate.now();
				LocalDate toDate = selectedDate.isBefore(today) ? selectedDate : today.minusDays(1);
				CoronaDataSession cdsBar = new CoronaDataSession();
				cdsBar.setSelectedDataType(cds.getSelectedDataType());
				cdsBar.setSelectedDataCategory(cds.getSelectedDataCategory());
				cdsBar.setSelectedTerritories(cds.getSelectedTerritories());
				cdsBar.setSelectedTerritoryParents(cds.getSelectedTerritoryParents());
				cdsBar.setFromDate(toDate);
				cdsBar.setToDate(toDate);
				Map<String,List<CoronaData>> map = getHistoricalData(cdsBar);
				map.keySet().forEach(t -> {
					coronaData.addAll(map.get(t));
				});
				break;
			default:
				cds.getSelectedTerritories().forEach(t -> {
					LocalDate date = selectedDate;
					Optional<LocalDate> maxDate = repo.getMaxDateRepByTerritoryId(t);
					if (maxDate.isPresent() && selectedDate.isAfter(maxDate.get())) {
						// get last data if no data available at selected date
						date = maxDate.get();
					}
					List<String> territory = new ArrayList<>();
					territory.add(t);
					repo.findByTerritoryIdInAndDateRepBetweenOrderByDateRep(territory, date, date).forEach(d -> {
						CoronaData cd = d.toCoronaData();
						cd.setCasesDaysPer100000Pop(getCasesPerDaysAnd100000(cd));
						coronaData.add(cd);
					});
				});
				break;
			}
		}
		
    	String title = "";
		switch (cds.getSelectedDataType() + "-" + cds.getSelectedDataCategory()) {
		default:
		case "infections-cumulated":
			title = messageSourceService.getMessage("chart.infections", cds.getLocale());
			coronaData.sort(Comparator.comparing(CoronaData::getCasesKum).reversed());
			break;
		case "infections-perDay":
			title = messageSourceService.getMessage("chart.infectionsPerDay", cds.getLocale());
			coronaData.sort(Comparator.comparing(CoronaData::getCases).reversed());
			break;
		case "infections-per100000":
			title = messageSourceService.getMessage("chart.infectionsPer100000", cds.getLocale());
			coronaData.sort(Comparator.comparing(CoronaData::getCasesPer100000Pop).reversed());
			break;
		case "infections-perDaysAnd100000":
			title = messageSourceService.getMessage("chart.infectionsPerDaysAnd100000", cds.getLocale(), daysToKum);
			coronaData.sort(Comparator.comparing(CoronaData::getCasesDaysPer100000Pop).reversed());
			break;
		case "deaths-cumulated":
			title = messageSourceService.getMessage("chart.deaths", cds.getLocale());
			coronaData.sort(Comparator.comparing(CoronaData::getDeathsKum).reversed());
			break;
		case "deaths-perDay":
			title = messageSourceService.getMessage("chart.deathsPerDay", cds.getLocale());
			coronaData.sort(Comparator.comparing(CoronaData::getDeaths).reversed());
			break;
		case "deaths-per100000":
			title = messageSourceService.getMessage("chart.deathsPer100000", cds.getLocale());
			coronaData.sort(Comparator.comparing(CoronaData::getDeathsPer100000Pop).reversed());
			break;
		case "deaths-perDaysAnd100000":
			title = messageSourceService.getMessage("chart.deathsPerDaysAnd100000", cds.getLocale(), daysToKum);
			coronaData.sort(Comparator.comparing(CoronaData::getDeathsDaysPer100000Pop).reversed());
			break;
		case "recovered-cumulated":
			title = messageSourceService.getMessage("chart.recovered", cds.getLocale());
			coronaData.sort(Comparator.comparing(CoronaData::getRecoveredKum).reversed());
			break;
		case "recovered-perDay":
			title = messageSourceService.getMessage("chart.recoveredPerDay", cds.getLocale());
			coronaData.sort(Comparator.comparing(CoronaData::getRecovered).reversed());
			break;
		case "recovered-per100000":
			title = messageSourceService.getMessage("chart.recoveredPer100000", cds.getLocale());
			coronaData.sort(Comparator.comparing(CoronaData::getRecoveredPer100000Pop).reversed());
			break;
		case "recovered-perDaysAnd100000":
			title = messageSourceService.getMessage("chart.recoveredPerDaysAnd100000", cds.getLocale(), daysToKum);
			coronaData.sort(Comparator.comparing(CoronaData::getRecoveredDaysPer100000Pop).reversed());
			break;
		case "active-cumulated":
			title = messageSourceService.getMessage("chart.active", cds.getLocale());
			coronaData.sort(Comparator.comparing(CoronaData::getActiveKum).reversed());
			break;
		case "active-perDay":
			title = messageSourceService.getMessage("chart.activePerDay", cds.getLocale());
			coronaData.sort(Comparator.comparing(CoronaData::getActive).reversed());
			break;
		case "active-per100000":
			title = messageSourceService.getMessage("chart.activePer100000", cds.getLocale());
			coronaData.sort(Comparator.comparing(CoronaData::getActivePer100000Pop).reversed());
			break;
		case "active-perDaysAnd100000":
			title = messageSourceService.getMessage("chart.activePerDaysAnd100000", cds.getLocale(), daysToKum);
			coronaData.sort(Comparator.comparing(CoronaData::getActiveDaysPer100000Pop).reversed());
			break;
		case "vaccinationFirst-cumulated":
			title = messageSourceService.getMessage("chart.vaccinationFirst", cds.getLocale());
			if ("percentage".equals(cds.getSelectedYAxisType())) {
				coronaData.sort(Comparator.comparing(CoronaData::getFirstVaccinationsKumPercentage).reversed());
			} else {
				coronaData.sort(Comparator.comparing(CoronaData::getFirstVaccinationsKum).reversed());
			}
			break;
		case "vaccinationFirst-perDay":
			title = messageSourceService.getMessage("chart.vaccinationFirstPerDay", cds.getLocale());
			if ("percentage".equals(cds.getSelectedYAxisType())) {
				coronaData.sort(Comparator.comparing(CoronaData::getFirstVaccinationsPercentage).reversed());
			} else {
				coronaData.sort(Comparator.comparing(CoronaData::getFirstVaccinations).reversed());
			}
			break;
		case "vaccinationFirst-per100000":
			title = messageSourceService.getMessage("chart.vaccinationFirstPer100000", cds.getLocale());
			coronaData.sort(Comparator.comparing(CoronaData::getFirstVaccinationsPer100000Pop).reversed());
			break;
		case "vaccinationFull-cumulated":
			title = messageSourceService.getMessage("chart.vaccinationFull", cds.getLocale());
			if ("percentage".equals(cds.getSelectedYAxisType())) {
				coronaData.sort(Comparator.comparing(CoronaData::getFullVaccinationsKumPercentage).reversed());
			} else {
				coronaData.sort(Comparator.comparing(CoronaData::getFullVaccinationsKum).reversed());
			}
			break;
		case "vaccinationFull-perDay":
			title = messageSourceService.getMessage("chart.vaccinationFullPerDay", cds.getLocale());
			if ("percentage".equals(cds.getSelectedYAxisType())) {
				coronaData.sort(Comparator.comparing(CoronaData::getFullVaccinationsPercentage).reversed());
			} else {
				coronaData.sort(Comparator.comparing(CoronaData::getFullVaccinations).reversed());
			}
			break;
		case "vaccinationFull-per100000":
			title = messageSourceService.getMessage("chart.vaccinationFullPer100000", cds.getLocale());
			coronaData.sort(Comparator.comparing(CoronaData::getFullVaccinationsPer100000Pop).reversed());
			break;
		case "vaccinationTotal-cumulated":
			title = messageSourceService.getMessage("chart.vaccinationTotal", cds.getLocale());
			if ("percentage".equals(cds.getSelectedYAxisType())) {
				coronaData.sort(Comparator.comparing(CoronaData::getTotalVaccinationsKumPercentage).reversed());
			} else {
				coronaData.sort(Comparator.comparing(CoronaData::getTotalVaccinationsKum).reversed());
			}
			break;
		case "vaccinationTotal-perDay":
			title = messageSourceService.getMessage("chart.vaccinationTotalPerDay", cds.getLocale());
			if ("percentage".equals(cds.getSelectedYAxisType())) {
				coronaData.sort(Comparator.comparing(CoronaData::getTotalVaccinationsPercentage).reversed());
			} else {
				coronaData.sort(Comparator.comparing(CoronaData::getTotalVaccinations).reversed());
			}
			break;
		case "vaccinationTotal-per100000":
			title = messageSourceService.getMessage("chart.vaccinationTotalPer100000", cds.getLocale());
			coronaData.sort(Comparator.comparing(CoronaData::getTotalVaccinationsPer100000Pop).reversed());
			break;
		}
				
    	data.setTitle(messageSourceService.getMessage("chart.top25", cds.getLocale()));
    	data.setSubTitle(selectedDate.format(DateTimeFormatter.ofPattern("dd.MM.yyyy")));
    	
    	YAxis yAxis = new YAxis();
    	yAxis.setTitle(title);
    	yAxis.setType(cds.getSelectedYAxisType());
    	data.setYAxis(yAxis);
    	
    	XAxis xAxis = new XAxis();
    	xAxis.setTitle(messageSourceService.getMessage("region", cds.getLocale()));
    	data.setXAxis(xAxis);
    	
    	BarSeries series = new BarSeries();
    	series.setTitle(title);
    	series.setColors(colorProps.getHexRGBColors());
    	series.setData(new ArrayList<>());
    	AtomicInteger counter = new AtomicInteger();
    	coronaData.forEach(d -> {
    		if (counter.get() >= 25) {
    			return;
    		}
    		counter.incrementAndGet();
        	List<Object> barData = new ArrayList<>();
        	barData.add(cache.getTerritoryName(d.getTerritoryId(), cds.getLocale()));
        	Double value = 0.0;
    		switch(cds.getSelectedDataType() + "-" + cds.getSelectedDataCategory()) {
    		case "infections-cumulated": value = getDouble(d.getCasesKum()); break;
    		case "infections-perDay": value = getDouble(d.getCases()); break;
    		case "infections-per100000": value = getDouble(d.getCasesPer100000Pop()); break;
    		case "infections-perDaysAnd100000": value = getDouble(d.getCasesDaysPer100000Pop()); break;
    		case "deaths-cumulated": value = getDouble(d.getDeathsKum()); break;
    		case "deaths-perDay": value = getDouble(d.getDeaths()); break;
    		case "deaths-per100000": value = getDouble(d.getDeathsPer100000Pop()); break;
    		case "deaths-perDaysAnd100000": value = getDouble(d.getDeathsDaysPer100000Pop()); break;
    		case "recovered-cumulated": value = getDouble(d.getRecoveredKum()); break;
    		case "recovered-perDay": value = getDouble(d.getRecovered()); break;
    		case "recovered-per100000": value = getDouble(d.getRecoveredPer100000Pop()); break;
    		case "recovered-perDaysAnd100000": value = getDouble(d.getRecoveredDaysPer100000Pop()); break;
    		case "active-cumulated": value = getDouble(d.getActiveKum()); break;
    		case "active-perDay": value = getDouble(d.getActive()); break;
    		case "active-per100000": value = getDouble(d.getActivePer100000Pop()); break;
    		case "active-perDaysAnd100000": value = getDouble(d.getActiveDaysPer100000Pop()); break;
    		case "vaccinationFirst-cumulated": value = getDouble(d.getFirstVaccinationsKum()); break;
    		case "vaccinationFirst-perDay": value = getDouble(d.getFirstVaccinations()); break;
    		case "vaccinationFirst-per100000": value = getDouble(d.getFirstVaccinationsPer100000Pop()); break;
    		case "vaccinationFull-cumulated": value = getDouble(d.getFullVaccinationsKum()); break;
    		case "vaccinationFull-perDay": value = getDouble(d.getFullVaccinations()); break;
    		case "vaccinationFull-per100000": value = getDouble(d.getFullVaccinationsPer100000Pop()); break;
    		case "vaccinationTotal-cumulated": value = getDouble(d.getTotalVaccinationsKum()); break;
    		case "vaccinationTotal-perDay": value = getDouble(d.getTotalVaccinations()); break;
    		case "vaccinationTotal-per100000": value = getDouble(d.getTotalVaccinationsPer100000Pop()); break;
    		default: value = 0.0; break;
    		}
			if ("percentage".equals(cds.getSelectedYAxisType())) {
				value = value * 100.0 / d.getPopulation();
			}
        	barData.add(value);
        	series.getData().add(barData);
    	});
    	data.setSeries(series);
    	
    	return data;
    }

    public LineChartData getInfectionsAndGraphData(CoronaDataSession cds) {
    	LineChartData data = new LineChartData();

    	String title = "";
    	String title1 = "";
    	String title2 = "";
		switch(cds.getSelectedDataType() + "-" + cds.getSelectedDataCategory()) {
		default:
		case "infections-cumulated":
			title = messageSourceService.getMessage("chart.infections", cds.getLocale());
			title1 = messageSourceService.getMessage("chart.infections", cds.getLocale());
			title2 = messageSourceService.getMessage("chart.deaths", cds.getLocale());
			break;
		case "infections-perDay":
			title = messageSourceService.getMessage("chart.infectionsPerDay", cds.getLocale());
			title1 = messageSourceService.getMessage("chart.infectionsPerDay", cds.getLocale());
			title2 = messageSourceService.getMessage("chart.deathsPerDay", cds.getLocale());
			break;
		case "infections-per100000":
			title = messageSourceService.getMessage("chart.infectionsPer100000", cds.getLocale());
			title1 = messageSourceService.getMessage("chart.infectionsPer100000", cds.getLocale());
			title2 = messageSourceService.getMessage("chart.deathsPer100000", cds.getLocale());
			break;
		case "infections-perDaysAnd100000":
			title = messageSourceService.getMessage("chart.infections", cds.getLocale());
			title1 = messageSourceService.getMessage("chart.infections", cds.getLocale());
			title2 = messageSourceService.getMessage("chart.infectionsPerDaysAnd100000", cds.getLocale(), daysToKum);
			break;
		case "deaths-cumulated":
			title = messageSourceService.getMessage("chart.infectionsAndDeaths", cds.getLocale());
			title1 = messageSourceService.getMessage("chart.infections", cds.getLocale());
			title2 = messageSourceService.getMessage("chart.deaths", cds.getLocale());
			break;
		case "deaths-perDay":
			title = messageSourceService.getMessage("chart.infectionsAndDeathsPerDay", cds.getLocale());
			title1 = messageSourceService.getMessage("chart.infectionsPerDay", cds.getLocale());
			title2 = messageSourceService.getMessage("chart.deathsPerDay", cds.getLocale());
			break;
		case "deaths-per100000":
			title = messageSourceService.getMessage("chart.infectionsAndDeathsPer100000", cds.getLocale());
			title1 = messageSourceService.getMessage("chart.infectionsPer100000", cds.getLocale());
			title2 = messageSourceService.getMessage("chart.deathsPer100000", cds.getLocale());
			break;
		case "deaths-perDaysAnd100000":
			title = messageSourceService.getMessage("chart.infectionsAndDeathsPerDaysAnd100000", cds.getLocale(), daysToKum);
			title1 = messageSourceService.getMessage("chart.infectionsPerDaysAnd100000", cds.getLocale(), daysToKum);
			title2 = messageSourceService.getMessage("chart.deathsPerDaysAnd100000", cds.getLocale(), daysToKum);
			break;
		case "recovered-cumulated":
			title = messageSourceService.getMessage("chart.infectionsAndRecovered", cds.getLocale());
			title1 = messageSourceService.getMessage("chart.infections", cds.getLocale());
			title2 = messageSourceService.getMessage("chart.recovered", cds.getLocale());
			break;
		case "recovered-perDay":
			title = messageSourceService.getMessage("chart.infectionsAndRecoveredPerDay", cds.getLocale());
			title1 = messageSourceService.getMessage("chart.infectionsPerDay", cds.getLocale());
			title2 = messageSourceService.getMessage("chart.recoveredPerDay", cds.getLocale());
			break;
		case "recovered-per100000":
			title = messageSourceService.getMessage("chart.infectionsAndRecoveredPer100000", cds.getLocale());
			title1 = messageSourceService.getMessage("chart.infectionsPer100000", cds.getLocale());
			title2 = messageSourceService.getMessage("chart.recoveredPer100000", cds.getLocale());
			break;
		case "recovered-perDaysAnd100000":
			title = messageSourceService.getMessage("chart.infectionsAndRecoveredPerDaysAnd100000", cds.getLocale(), daysToKum);
			title1 = messageSourceService.getMessage("chart.infectionsPerDaysAnd100000", cds.getLocale(), daysToKum);
			title2 = messageSourceService.getMessage("chart.recoveredPerDaysAnd100000", cds.getLocale(), daysToKum);
			break;
		case "active-cumulated":
			title = messageSourceService.getMessage("chart.infectionsAndActive", cds.getLocale());
			title1 = messageSourceService.getMessage("chart.infections", cds.getLocale());
			title2 = messageSourceService.getMessage("chart.active", cds.getLocale());
			break;
		case "active-perDay":
			title = messageSourceService.getMessage("chart.infectionsAndActivePerDay", cds.getLocale());
			title1 = messageSourceService.getMessage("chart.infectionsPerDay", cds.getLocale());
			title2 = messageSourceService.getMessage("chart.activePerDay", cds.getLocale());
			break;
		case "active-per100000":
			title = messageSourceService.getMessage("chart.infectionsAndActivePer100000", cds.getLocale());
			title1 = messageSourceService.getMessage("chart.infectionsPer100000", cds.getLocale());
			title2 = messageSourceService.getMessage("chart.activePer100000", cds.getLocale());
			break;
		case "active-perDaysAnd100000":
			title = messageSourceService.getMessage("chart.infectionsAndActivePerDaysAnd100000", cds.getLocale(), daysToKum);
			title1 = messageSourceService.getMessage("chart.infectionsPerDaysAnd100000", cds.getLocale(), daysToKum);
			title2 = messageSourceService.getMessage("chart.activePerDaysAnd100000", cds.getLocale(), daysToKum);
			break;
		case "vaccinationFirst-cumulated":
			title = messageSourceService.getMessage("chart.infectionsAndVaccinationFirst", cds.getLocale());
			title1 = messageSourceService.getMessage("chart.infections", cds.getLocale());
			title2 = messageSourceService.getMessage("chart.vaccinationFirst", cds.getLocale());
			break;
		case "vaccinationFirst-perDay":
			title = messageSourceService.getMessage("chart.infectionsAndVaccinationFirstPerDay", cds.getLocale());
			title1 = messageSourceService.getMessage("chart.infectionsPerDay", cds.getLocale());
			title2 = messageSourceService.getMessage("chart.vaccinationFirstPerDay", cds.getLocale());
			break;
		case "vaccinationFirst-per100000":
			title = messageSourceService.getMessage("chart.infectionsAndVaccinationFirstPer100000", cds.getLocale());
			title1 = messageSourceService.getMessage("chart.infectionsPer100000", cds.getLocale());
			title2 = messageSourceService.getMessage("chart.vaccinationFirstPer100000", cds.getLocale());
			break;
		case "vaccinationFull-cumulated":
			title = messageSourceService.getMessage("chart.infectionsAndVaccinationFull", cds.getLocale());
			title1 = messageSourceService.getMessage("chart.infections", cds.getLocale());
			title2 = messageSourceService.getMessage("chart.vaccinationFull", cds.getLocale());
			break;
		case "vaccinationFull-perDay":
			title = messageSourceService.getMessage("chart.infectionsAndVaccinationFullPerDay", cds.getLocale());
			title1 = messageSourceService.getMessage("chart.infectionsPerDay", cds.getLocale());
			title2 = messageSourceService.getMessage("chart.vaccinationFullPerDay", cds.getLocale());
			break;
		case "vaccinationFull-per100000":
			title = messageSourceService.getMessage("chart.infectionsAndVaccinationFullPer100000", cds.getLocale());
			title1 = messageSourceService.getMessage("chart.infectionsPer100000", cds.getLocale());
			title2 = messageSourceService.getMessage("chart.vaccinationFullPer100000", cds.getLocale());
			break;
		case "vaccinationTotal-cumulated":
			title = messageSourceService.getMessage("chart.infectionsAndVaccinationTotal", cds.getLocale());
			title1 = messageSourceService.getMessage("chart.infections", cds.getLocale());
			title2 = messageSourceService.getMessage("chart.vaccinationTotal", cds.getLocale());
			break;
		case "vaccinationTotal-perDay":
			title = messageSourceService.getMessage("chart.infectionsAndVaccinationTotalPerDay", cds.getLocale());
			title1 = messageSourceService.getMessage("chart.infectionsPerDay", cds.getLocale());
			title2 = messageSourceService.getMessage("chart.vaccinationTotalPerDay", cds.getLocale());
			break;
		case "vaccinationTotal-per100000":
			title = messageSourceService.getMessage("chart.infectionsAndVaccinationTotalPer100000", cds.getLocale());
			title1 = messageSourceService.getMessage("chart.infectionsPer100000", cds.getLocale());
			title2 = messageSourceService.getMessage("chart.vaccinationTotalPer100000", cds.getLocale());
			break;
		}
    	
    	data.setTitle(messageSourceService.getMessage("chart.historical", cds.getLocale()));
    	data.setSubTitle(title);
    	
    	YAxis yAxis = new YAxis();
    	yAxis.setTitle1(title1);
    	yAxis.setTitle2(title2);
    	yAxis.setType(cds.getSelectedYAxisType());
    	data.setYAxis(yAxis);
    	
    	Map<String,List<CoronaData>> territoryMap = new HashMap<>();
		if (!CollectionUtils.isEmpty(cds.getSelectedTerritories())) {
			territoryMap.putAll(getHistoricalData(cds));
		}

    	XAxis xAxis = getXAxisWithDates(cds);
    	data.setXAxis(xAxis);
    	
    	Iterator<ColorProperty> colorIterator = colorProps.getDarkColors().iterator();
    	
    	Double[] max2Array = new Double[1];
    	max2Array[0] = 0.0;
    	List<Series> series = new ArrayList<>();
		territoryMap.keySet().forEach(tk -> {
			ColorProperty darkColorProp = colorIterator.hasNext() ? colorIterator.next() : colorProps.getDarkColors().iterator().next();
			String darkColor = darkColorProp.getHexRGB();
			Color dc = Color.decode(darkColor);
			Color bc = this.brighten(dc, 0.5);
			String brightenColor = String.format("#%02X%02X%02X", bc.getRed(), bc.getGreen(), bc.getBlue());
			
	    	Series i = new Series();
	    	i.setName(cache.getTerritoryName(tk, cds.getLocale()) + " - " + messageSourceService.getMessage("chart.infections", cds.getLocale()));
	    	i.setColor(darkColor);
	    	i.setData(new ArrayList<>());
	    	
	    	Series d = new Series();
	    	String namePostfix = messageSourceService.getMessage("chart." + cds.getSelectedDataType(), cds.getLocale());
	    	d.setName(cache.getTerritoryName(tk, cds.getLocale()) + " - " + namePostfix);
	    	d.setYAxis(1);
	    	d.setDashStyle("ShortDash");
	    	d.setColor(brightenColor);
	    	d.setData(new ArrayList<>());
	    	
	    	Map<String, Double> lastMap = new HashMap<>();
	    	lastMap.put("dValue", 0.0);
	    	territoryMap.get(tk).forEach(t -> {
				log.debug(t.toString());
				double iValue = 0.0;
				double dValue = 0.0;
	    		switch(cds.getSelectedDataType() + "-" + cds.getSelectedDataCategory()) {
				default:
				case "infections-cumulated":
					iValue = getDouble(t.getCasesKum());
					dValue = 0.0;
					break;
				case "infections-perDay":
					iValue = getDouble(t.getCases());
					dValue = 0.0;
					break;
				case "infections-per100000":
					iValue = getDouble(t.getCasesPer100000Pop());
					dValue = 0.0;
					break;
				case "infections-perDaysAnd100000":
					iValue = getDouble(t.getCasesKum());
					dValue = getDouble(t.getCasesDaysPer100000Pop());
					break;
				case "deaths-cumulated":
					iValue = getDouble(t.getCasesKum());
					dValue = getDouble(t.getDeathsKum());
					break;
				case "deaths-perDay":
					iValue = getDouble(t.getCases());
					dValue = getDouble(t.getDeaths());
					break;
				case "deaths-per100000":
					iValue = getDouble(t.getCasesPer100000Pop());
					dValue = getDouble(t.getDeathsPer100000Pop());
					break;
				case "deaths-perDaysAnd100000":
					iValue = getDouble(t.getCasesDaysPer100000Pop());
					dValue = getDouble(t.getDeathsDaysPer100000Pop());
					break;
				case "recovered-cumulated":
					iValue = getDouble(t.getCasesKum());
					dValue = getDouble(t.getRecoveredKum());
					break;
				case "recovered-perDay":
					iValue = getDouble(t.getCases());
					dValue = getDouble(t.getRecovered());
					break;
				case "recovered-per100000":
					iValue = getDouble(t.getCasesPer100000Pop());
					dValue = getDouble(t.getRecoveredPer100000Pop());
					break;
				case "recovered-perDaysAnd100000":
					iValue = getDouble(t.getCasesDaysPer100000Pop());
					dValue = getDouble(t.getRecoveredDaysPer100000Pop());
					break;
				case "active-cumulated":
					iValue = getDouble(t.getCasesKum());
					dValue = getDouble(t.getActiveKum());
					break;
				case "active-perDay":
					iValue = getDouble(t.getCases());
					dValue = getDouble(t.getActive());
					break;
				case "active-per100000":
					iValue = getDouble(t.getCasesPer100000Pop());
					dValue = getDouble(t.getActivePer100000Pop());
					break;
				case "active-perDaysAnd100000":
					iValue = getDouble(t.getCasesDaysPer100000Pop());
					dValue = getDouble(t.getActiveDaysPer100000Pop());
					break;
				case "vaccinationFirst-cumulated":
					iValue = getDouble(t.getCasesKum());
					dValue = getDouble(t.getFirstVaccinationsKum());
					break;
				case "vaccinationFirst-perDay":
					iValue = getDouble(t.getCases());
					dValue = getDouble(t.getFirstVaccinations());
					break;
				case "vaccinationFirst-per100000":
					iValue = getDouble(t.getCasesPer100000Pop());
					dValue = getDouble(t.getFirstVaccinationsPer100000Pop());
					break;
				case "vaccinationFull-cumulated":
					iValue = getDouble(t.getCasesKum());
					dValue = getDouble(t.getFullVaccinationsKum());
					break;
				case "vaccinationFull-perDay":
					iValue = getDouble(t.getCases());
					dValue = getDouble(t.getFullVaccinations());
					break;
				case "vaccinationFull-per100000":
					iValue = getDouble(t.getCasesPer100000Pop());
					dValue = getDouble(t.getFullVaccinationsPer100000Pop());
					break;
				case "vaccinationTotal-cumulated":
					iValue = getDouble(t.getCasesKum());
					dValue = getDouble(t.getTotalVaccinationsKum());
					break;
				case "vaccinationTotal-perDay":
					iValue = getDouble(t.getCases());
					dValue = getDouble(t.getTotalVaccinations());
					break;
				case "vaccinationTotal-per100000":
					iValue = getDouble(t.getCasesPer100000Pop());
					dValue = getDouble(t.getTotalVaccinationsPer100000Pop());
					break;
	    		}
	    		if ("percentage".equals(cds.getSelectedYAxisType())) {
	    			iValue = iValue * 100.0 / t.getPopulation();
	    			dValue = dValue * 100.0 / t.getPopulation();
	    		}
	    		if (iValue < 0.0) {
	    			iValue = 0.0;
	    		}
	    		if (!"perDay".equals(cds.getSelectedDataCategory())) {
					if (dValue > 0.0) {
						lastMap.put("dValue", dValue);
					} else {
						dValue = lastMap.get("dValue");
					}
	    		}
				i.getData().add(iValue);
				d.getData().add(dValue);
	    		
		    	if ("linear".equals(yAxis.getType()) || "percentage".equals(yAxis.getType())) {
		    		yAxis.setMin1(0.0);
		    		yAxis.setMin2(0.0);
		    	} else {
		    		if (yAxis.getMin1() == null) {
		    			yAxis.setMin1(0.01);
		    		}
		    		if (yAxis.getMin2() == null) {
		    			yAxis.setMin2(0.01);
		    		}
		    		
		    		if (yAxis.getMin1() > iValue && iValue > 0.0) {
		    			yAxis.setMin1(iValue);
		    		}		    		
		    		if (yAxis.getMin2() > dValue && dValue > 0.0) {
		    			yAxis.setMin2(dValue);
		    		}
		    	}
		    	
		    	if (max2Array[0] < dValue) {
		    		max2Array[0] = dValue;
		    	}
	    	});
	    	//double max2 = ((long)((max2Array[0] * 6) + 10.0) * 10.0) / 10.0;
	    	//yAxis.setMax2(max2);
	    	series.add(i);
	    	series.add(d);
		});
    	data.setSeries(series);
    	
        return data;
    }

    public StackedAreaChartData getStackedAreaChartData(CoronaDataSession cds) {
    	StackedAreaChartData data = new StackedAreaChartData();
    	
		Map<String, List<CoronaData>> territoryMap = new HashMap<>();
		if (!CollectionUtils.isEmpty(cds.getSelectedTerritories())) {
			territoryMap.putAll(getHistoricalData(cds));
		}

    	String title = getTitleBySelectedData(cds);
    	data.setTitle(messageSourceService.getMessage("chart.historicalStackedAreas", cds.getLocale()));
    	data.setSubTitle(title);
    	
    	YAxis yAxis = new YAxis();
    	yAxis.setTitle(title);
    	yAxis.setType(cds.getSelectedYAxisType());
    	data.setYAxis(yAxis);
    	
    	XAxis xAxis = getXAxisWithDates(cds);
    	data.setXAxis(xAxis);
    	
    	data.setSeries(new ArrayList<>());
    	AtomicInteger counter = new AtomicInteger();
    	territoryMap.keySet().forEach(t -> {
        	StackedAreaSeries series = new StackedAreaSeries();
        	series.setData(new ArrayList<>());
        	if (counter.get() == colorProps.getColors().size()) {
        		counter.set(0);
        	}
        	series.setColor(colorProps.getColors().get(counter.get()).getHexRGB());
        	series.setName(cache.getTerritoryName(t, cds.getLocale()));
        	counter.incrementAndGet();
        	
	    	Map<String, Double> valueMap = new HashMap<>();
	    	territoryMap.get(t).forEach(d -> {
				log.debug(d.toString());
				double value = getValueBySelectedData(cds, d);
	    		if (!"perDay".equals(cds.getSelectedDataCategory())) {
			    	if (value == 0.0) {
			    		value = getDouble(valueMap.get("last"));
			    	} else {
			    		valueMap.put("last", value);
			    	}
	    		}
	    		if ("percentage".equals(cds.getSelectedYAxisType())) {
	    			value = value * 100.0 / d.getPopulation();
	    		}
		    	if ("logarithmic".equals(yAxis.getType()) && value < 0.0001) {
		    		value = 0.1;
		    	}
	    		series.getData().add(value);
	    		
		    	if ("linear".equals(yAxis.getType()) || "percentage".equals(yAxis.getType())) {
		    		yAxis.setMin(0.0);
		    	} else {
		    		if (yAxis.getMin() == null) {
		    			yAxis.setMin(1.0);
		    		}
		    		
		    		if (yAxis.getMin() > value && value > 0.0) {
		    			yAxis.setMin(value);
		    		}
		    	}
	    	});
            data.getSeries().add(series);
    	});
    	
    	return data;
    }
    
    public StackedBarChartData getStackedBarChartData(CoronaDataSession cds) {
    	StackedBarChartData data = new StackedBarChartData();
    	
		Map<String, CoronaData> coronaData = new HashMap<>();
		if (!CollectionUtils.isEmpty(cds.getSelectedTerritories())) {
			cds.getSelectedTerritories().forEach(t -> {
				Optional<CoronaDataEntity> entity;
				switch (cds.getSelectedDataType()) {
				case "infections":
				default:
					entity = repo.getFirstByTerritoryIdAndCasesKumGreaterThanOrderByCasesKumAscDateRepAsc(t, 0L);
					break;
				case "deaths":
					entity = repo.getFirstByTerritoryIdAndDeathsKumGreaterThanOrderByDeathsKumAscDateRepAsc(t, 0L);
					break;
				case "recovered":
					entity = repo.getFirstByTerritoryIdAndRecoveredKumGreaterThanOrderByRecoveredKumAscDateRepAsc(t, 0L);
					break;
				case "active":
					entity = repo.getFirstByTerritoryIdAndActiveKumGreaterThanOrderByActiveKumAscDateRepAsc(t, 0L);
					break;
				case "vaccinationFirst":
					entity = repo.getFirstByTerritoryIdAndFirstVaccinationsKumGreaterThanOrderByFirstVaccinationsKumAscDateRepAsc(t, 0L);
					break;
				case "vaccinationFull":
					entity = repo.getFirstByTerritoryIdAndFullVaccinationsKumGreaterThanOrderByFullVaccinationsKumAscDateRepAsc(t, 0L);
					break;
				case "vaccinationTotal":
					entity = repo.getFirstByTerritoryIdAndTotalVaccinationsKumGreaterThanOrderByTotalVaccinationsKumAscDateRepAsc(t, 0L);
					break;
				}
				if (entity.isPresent()) {
					CoronaDataEntity e = entity.get();
					if (e.getDateRep().isAfter(cds.getFromDate().minusDays(1)) && e.getDateRep().isBefore(cds.getToDate().plusDays(1))) {
						log.debug("{}", e.toString());
						coronaData.put(e.getTerritoryId(), e.toCoronaData());
					}
				}
			});
		}

    	String title = "";
    	String yAxisTitle = "";
		switch (cds.getSelectedDataType()) {
		case "infections":
		default:
			title = messageSourceService.getMessage("chart.startOfInfections", cds.getLocale());
			yAxisTitle = messageSourceService.getMessage("chart.infections", cds.getLocale());
			break;
		case "deaths":
			title = messageSourceService.getMessage("chart.startOfDeaths", cds.getLocale());
			yAxisTitle = messageSourceService.getMessage("chart.deaths", cds.getLocale());
			break;
		case "recovered":
			title = messageSourceService.getMessage("chart.startOfRecovered", cds.getLocale());
			yAxisTitle = messageSourceService.getMessage("chart.recovered", cds.getLocale());
			break;
		case "active":
			title = messageSourceService.getMessage("chart.startOfActive", cds.getLocale());
			yAxisTitle = messageSourceService.getMessage("chart.active", cds.getLocale());
			break;
		case "vaccinationFirst":
			title = messageSourceService.getMessage("chart.startOfVaccinationFirst", cds.getLocale());
			yAxisTitle = messageSourceService.getMessage("chart.vaccinationFirst", cds.getLocale());
			break;
		case "vaccinationFull":
			title = messageSourceService.getMessage("chart.startOfVaccinationFull", cds.getLocale());
			yAxisTitle = messageSourceService.getMessage("chart.vaccinationFull", cds.getLocale());
			break;
		case "vaccinationTotal":
			title = messageSourceService.getMessage("chart.startOfVaccinationTotal", cds.getLocale());
			yAxisTitle = messageSourceService.getMessage("chart.vaccinationTotal", cds.getLocale());
			break;
		}
    	data.setTitle(title);
    	
    	YAxis yAxis = new YAxis();
    	yAxis.setTitle(yAxisTitle);
    	yAxis.setType(cds.getSelectedYAxisType());
    	data.setYAxis(yAxis);
    	
    	XAxis xAxis = getXAxisWithDates(cds);
    	data.setXAxis(xAxis);
    	
    	data.setSeries(new ArrayList<>());
    	AtomicInteger counter = new AtomicInteger();
    	coronaData.keySet().forEach(t -> {
        	StackedBarSeries series = new StackedBarSeries();
        	series.setData(new ArrayList<>());
        	if (counter.get() == colorProps.getColors().size()) {
        		counter.set(0);
        	}
        	series.setColor(colorProps.getColors().get(counter.get()).getHexRGB());
        	series.setName(cache.getTerritoryName(t, cds.getLocale()));
        	counter.incrementAndGet();
        	
        	CoronaData cd = coronaData.get(t);
            for (LocalDate date = cds.getFromDate(); date.isBefore(cds.getToDate().plusDays(1)); date=date.plusDays(1)) {
        		if (date.isEqual(cd.getDateRep())) {
        			switch (cds.getSelectedDataType()) {
        			case "infections": series.getData().add(getDouble(cd.getCases())); break;
        			case "deaths": series.getData().add(getDouble(cd.getDeaths())); break;
        			case "recovered": series.getData().add(getDouble(cd.getRecovered())); break;
        			case "active": series.getData().add(getDouble(cd.getActive())); break;
        			case "vaccinationFirst": series.getData().add(getDouble(cd.getFirstVaccinationsKum())); break;
        			case "vaccinationFull": series.getData().add(getDouble(cd.getFullVaccinationsKum())); break;
        			case "vaccinationTotal": series.getData().add(getDouble(cd.getTotalVaccinationsKum())); break;
        			default: series.getData().add(0.0); break;
        			}
        		} else {
        			series.getData().add(0.0);
        		}
        	}
            data.getSeries().add(series);
    	});
    	
    	return data;
    }

	private String getTitleBySelectedData(CoronaDataSession cds) {
		String title = "";
		switch (cds.getSelectedDataType() + "-" + cds.getSelectedDataCategory()) {
		default:
		case "infections-cumulated":
			title = messageSourceService.getMessage("chart.infections", cds.getLocale());
			break;
		case "infections-perDay":
			title = messageSourceService.getMessage("chart.infectionsPerDay", cds.getLocale());
			break;
		case "infections-per100000":
			title = messageSourceService.getMessage("chart.infectionsPer100000", cds.getLocale());
			break;
		case "infections-perDaysAnd100000":
			title = messageSourceService.getMessage("chart.infectionsPerDaysAnd100000", cds.getLocale(), daysToKum);
			break;
		case "deaths-cumulated":
			title = messageSourceService.getMessage("chart.deaths", cds.getLocale());
			break;
		case "deaths-perDay":
			title = messageSourceService.getMessage("chart.deathsPerDay", cds.getLocale());
			break;
		case "deaths-per100000":
			title = messageSourceService.getMessage("chart.deathsPer100000", cds.getLocale());
			break;
		case "deaths-perDaysAnd100000":
			title = messageSourceService.getMessage("chart.deathsPerDaysAnd100000", cds.getLocale(), daysToKum);
			break;
		case "recovered-cumulated":
			title = messageSourceService.getMessage("chart.recovered", cds.getLocale());
			break;
		case "recovered-perDay":
			title = messageSourceService.getMessage("chart.recoveredPerDay", cds.getLocale());
			break;
		case "recovered-per100000":
			title = messageSourceService.getMessage("chart.recoveredPer100000", cds.getLocale());
			break;
		case "recovered-perDaysAnd100000":
			title = messageSourceService.getMessage("chart.recoveredPerDaysAnd100000", cds.getLocale(), daysToKum);
			break;
		case "active-cumulated":
			title = messageSourceService.getMessage("chart.active", cds.getLocale());
			break;
		case "active-perDay":
			title = messageSourceService.getMessage("chart.activePerDay", cds.getLocale());
			break;
		case "active-per100000":
			title = messageSourceService.getMessage("chart.activePer100000", cds.getLocale());
			break;
		case "active-perDaysAnd100000":
			title = messageSourceService.getMessage("chart.activePerDaysAnd100000", cds.getLocale(), daysToKum);
			break;
		case "vaccinationFirst-cumulated":
			title = messageSourceService.getMessage("chart.vaccinationFirst", cds.getLocale());
			break;
		case "vaccinationFirst-perDay":
			title = messageSourceService.getMessage("chart.vaccinationFirstPerDay", cds.getLocale());
			break;
		case "vaccinationFirst-per100000":
			title = messageSourceService.getMessage("chart.vaccinationFirstPer100000", cds.getLocale());
			break;
		case "vaccinationFull-cumulated":
			title = messageSourceService.getMessage("chart.vaccinationFull", cds.getLocale());
			break;
		case "vaccinationFull-perDay":
			title = messageSourceService.getMessage("chart.vaccinationFullPerDay", cds.getLocale());
			break;
		case "vaccinationFull-per100000":
			title = messageSourceService.getMessage("chart.vaccinationFullPer100000", cds.getLocale());
			break;
		case "vaccinationTotal-cumulated":
			title = messageSourceService.getMessage("chart.vaccinationTotal", cds.getLocale());
			break;
		case "vaccinationTotal-perDay":
			title = messageSourceService.getMessage("chart.vaccinationTotalPerDay", cds.getLocale());
			break;
		case "vaccinationTotal-per100000":
			title = messageSourceService.getMessage("chart.vaccinationTotalPer100000", cds.getLocale());
			break;
		}
		return title;
	}

	private double getValueBySelectedData(CoronaDataSession cds, CoronaData d) {
		double value = 0.0;
		switch(cds.getSelectedDataType() + "-" + cds.getSelectedDataCategory()) {
		default:
		case "infections-cumulated": value = getDouble(d.getCasesKum()); break;
		case "infections-perDay": value = getDouble(d.getCases()); break;
		case "infections-per100000": value = getDouble(d.getCasesPer100000Pop()); break;
		case "infections-perDaysAnd100000": value = getCasesPerDaysAnd100000(d); break;
		case "deaths-cumulated": value = getDouble(d.getDeathsKum()); break;
		case "deaths-perDay": value = getDouble(d.getDeaths()); break;
		case "deaths-per100000": value = getDouble(d.getDeathsPer100000Pop()); break;
		case "deaths-perDaysAnd100000": value = getDouble(d.getDeathsDaysPer100000Pop()); break;
		case "recovered-cumulated": value = getDouble(d.getRecoveredKum()); break;
		case "recovered-perDay": value = getDouble(d.getRecovered()); break;
		case "recovered-per100000": value = getDouble(d.getRecoveredPer100000Pop()); break;
		case "recovered-perDaysAnd100000": value = getDouble(d.getRecoveredDaysPer100000Pop()); break;
		case "active-cumulated": value = getDouble(d.getActiveKum()); break;
		case "active-perDay": value = getDouble(d.getActive()); break;
		case "active-per100000": value = getDouble(d.getActivePer100000Pop()); break;
		case "active-perDaysAnd100000": value = getDouble(d.getActiveDaysPer100000Pop()); break;
		case "vaccinationFirst-cumulated": value = getDouble(d.getFirstVaccinationsKum()); break;
		case "vaccinationFirst-perDay": value = getDouble(d.getFirstVaccinations()); break;
		case "vaccinationFirst-per100000": value = getDouble(d.getFirstVaccinationsPer100000Pop()); break;
		case "vaccinationFull-cumulated": value = getDouble(d.getFullVaccinationsKum()); break;
		case "vaccinationFull-perDay": value = getDouble(d.getFullVaccinations()); break;
		case "vaccinationFull-per100000": value = getDouble(d.getFullVaccinationsPer100000Pop()); break;
		case "vaccinationTotal-cumulated": value = getDouble(d.getTotalVaccinationsKum()); break;
		case "vaccinationTotal-perDay": value = getDouble(d.getTotalVaccinations()); break;
		case "vaccinationTotal-per100000": value = getDouble(d.getTotalVaccinationsPer100000Pop()); break;
		}
		if (value < 0.0) {
			value = 0.0;
		}
		if ("percentage".equals(cds.getSelectedYAxisType())) {
			value = value * 100.0 / d.getPopulation();
		}
		return value;
	}

	private Map<String,List<CoronaData>> getHistoricalData(CoronaDataSession cds) {
		//log.info("-> getHistoricalData");
		Map<String,List<CoronaData>> territoryMap = new HashMap<>();
		
		List<CompletableFuture<Map<String,List<CoronaData>>>> asyncs = new ArrayList<>();
		
		int subListSize = (int)(cds.getSelectedTerritories().size() / 4.0);
		if (cds.getSelectedTerritories().size() % 4 > 0) {
			subListSize += 1;
		}
		log.debug("getHistoricalData: size = {}, subListSize = {}", cds.getSelectedTerritories().size(), subListSize);
		
		int fromIndex = 0;
		int toIndex = subListSize;
		while  (fromIndex < toIndex) {
			List<String> subList = cds.getSelectedTerritories().subList(fromIndex, toIndex);
			log.debug("getHistoricalData: fromIndex = {}, toIndex = {}, subList = {}", fromIndex, toIndex, subList);
			fromIndex += subListSize;
			toIndex += subListSize;
			
			LocalDate fromDate = cds.getFromDate();
			switch (cds.getSelectedDataCategory()) {
			case "perDaysAnd100000":
				// 7 days/100.000
				fromDate = fromDate.minusDays(daysToKum);
				break;
			}
			asyncs.add(asyncService.getHistoricalDataAsync(subList, cds, LocalDate.from(fromDate)));
			if (toIndex > cds.getSelectedTerritories().size()) {
				toIndex = cds.getSelectedTerritories().size();
			}
			log.debug("getHistoricalData: fromIndex = {}, toIndex = {}", fromIndex, toIndex);
		}
		
		asyncs.forEach(async -> {
			try {
				Map<String,List<CoronaData>> asyncMap = async.get();
				territoryMap.putAll(asyncMap);
				log.debug("getHistoricalData: {} added", asyncMap.keySet());
			} catch (InterruptedException | ExecutionException e) {
				log.error("getHistoricalData: Exception {}", e);
			}
		});

		//log.info("<- getHistoricalData");
		return territoryMap;
	}
	
	private XAxis getXAxisWithDates(CoronaDataSession cds) {
		List<String> dates = new ArrayList<>();
        for (LocalDate date = cds.getFromDate(); date.isBefore(cds.getToDate().plusDays(1)); date=date.plusDays(1)) {
        	dates.add(date.format(DateTimeFormatter.ofPattern("dd.MM.")));
        }
    	XAxis xAxis = new XAxis();
    	xAxis.setTitle(messageSourceService.getMessage("date", cds.getLocale()));
    	xAxis.setDates(dates);
		return xAxis;
	}

	private double getCasesPerDaysAnd100000(CoronaData d) {
		return getDouble(d.getPopulation()) > 0L ? (getDouble(d.getCasesDaysKum()) * (double)daysToKumPop / d.getPopulation()) : 0.0;
	}

	/**
     * Make a color brighten.
     *
     * @param color Color to make brighten.
     * @param fraction Darkness fraction.
     * @return Lighter color.
     */
    private Color brighten(Color color, double fraction) {

        int red = (int) Math.round(Math.min(255, color.getRed() + 255 * fraction));
        int green = (int) Math.round(Math.min(255, color.getGreen() + 255 * fraction));
        int blue = (int) Math.round(Math.min(255, color.getBlue() + 255 * fraction));

        int alpha = color.getAlpha();

        return new Color(red, green, blue, alpha);

    }

}
