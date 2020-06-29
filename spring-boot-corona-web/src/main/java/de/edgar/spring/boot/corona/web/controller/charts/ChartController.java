package de.edgar.spring.boot.corona.web.controller.charts;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.SessionAttributes;

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
import de.edgar.spring.boot.corona.web.model.charts.StackedBarChartData;
import de.edgar.spring.boot.corona.web.model.charts.StackedBarSeries;
import de.edgar.spring.boot.corona.web.model.charts.XAxis;
import de.edgar.spring.boot.corona.web.model.charts.YAxis;
import de.edgar.spring.boot.corona.web.service.MessageSourceService;
import lombok.extern.slf4j.Slf4j;

/**
 * User: gardiary
 * Date: 12/11/17, 21:31
 */
@Slf4j
@RestController
@SessionAttributes("coronaDataSession")
public class ChartController {
	
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

	@GetMapping("/ajax/lineGraph")
    public LineChartData getLineGraph(@ModelAttribute CoronaDataSession cds) {
    	LineChartData data = new LineChartData();

    	String title = "";
		switch(cds.getSelectedDataType()) {
		default:
		case "infections": title = messageSourceService.getMessage("chart.infections", cds.getLocale()); break;
		case "infectionsPerDay": title = messageSourceService.getMessage("chart.infectionsPerDay", cds.getLocale()); break;
		case "infectionsPer100000": title = messageSourceService.getMessage("chart.infectionsPer100000", cds.getLocale()); break;
		case "infectionsPerDaysAnd100000": title = messageSourceService.getMessage("chart.infectionsPerDaysAnd100000", cds.getLocale(), daysToKum); break;
		case "deaths": title = messageSourceService.getMessage("chart.deaths", cds.getLocale()); break;
		case "deathsPerDay": title = messageSourceService.getMessage("chart.deathsPerDay", cds.getLocale()); break;
		case "deathsPer100000": title = messageSourceService.getMessage("chart.deathsPer100000", cds.getLocale()); break;
		}
    	
    	data.setTitle(messageSourceService.getMessage("chart.historical", cds.getLocale()));
    	data.setSubTitle(title);
    	
    	YAxis yAxis = new YAxis();
    	yAxis.setTitle(title);
    	yAxis.setType(cds.getSelectedYAxisType());
    	data.setYAxis(yAxis);
    	
    	Map<String,List<CoronaData>> territoryMap = new HashMap<>();
		if (!CollectionUtils.isEmpty(cds.getSelectedTerritories())) {
			List<CoronaData> coronaData = new ArrayList<>();
			repo.findByTerritoryInAndDateRepBetween(cds.getSelectedTerritories(), cds.getFromDate(), cds.getToDate()).forEach(d -> {
				coronaData.add(d.toCoronaData());
			});
			coronaData.sort(Comparator.comparing(CoronaData::getDateRep));
			coronaData.forEach(d -> { 
				List<CoronaData> coronaDataList = territoryMap.get(d.getTerritory());
				LocalDate lastDate;
				if (coronaDataList == null) {
					coronaDataList = new ArrayList<>();
					if (d.getDateRep().isAfter(cds.getFromDate())) {
						CoronaData cd;
				        for (LocalDate date = cds.getFromDate(); date.isBefore(d.getDateRep()); date=date.plusDays(1)) {
				        	cd = new CoronaData();
				        	cd.setDateRep(date);
				        	cd.setTerritory(d.getTerritory());
				        	cd.setTerritoryCode(d.getTerritoryCode());
				        	cd.setTerritoryParent(d.getTerritoryParent());
				        	cd.setCases(0L);
				        	cd.setCasesKum(0L);
				        	cd.setCasesDaysKum(0L);
				        	cd.setCasesPer100000Pop(0.0);
				        	cd.setDeaths(0L);
				        	cd.setDeathsKum(0L);
				        	cd.setDeathsPer100000Pop(0.0);
				        	cd.setGeoId(d.getGeoId());
				        	cd.setPopulation(d.getPopulation());
				        	coronaDataList.add(cd);
				        	lastDate = date;
				        }
					}
					territoryMap.put(d.getTerritory(), coronaDataList);
				}
				if (coronaDataList.size() > 0) {
					lastDate = coronaDataList.get(coronaDataList.size()-1).getDateRep();
					CoronaData cd;
					for (LocalDate day = lastDate.plusDays(1L); day.isBefore(d.getDateRep()); day = day.plusDays(1)) {
			        	cd = new CoronaData();
			        	cd.setDateRep(day);
			        	cd.setTerritory(d.getTerritory());
			        	cd.setTerritoryCode(d.getTerritoryCode());
			        	cd.setTerritoryParent(d.getTerritoryParent());
			        	cd.setCases(0L);
			        	cd.setCasesKum(d.getCasesKum());
			        	cd.setCasesDaysKum(d.getCasesDaysKum());
			        	cd.setCasesPer100000Pop(d.getCasesPer100000Pop());
			        	cd.setDeaths(0L);
			        	cd.setDeathsKum(d.getDeathsKum());
			        	cd.setDeathsPer100000Pop(d.getDeathsPer100000Pop());
			        	cd.setGeoId(d.getGeoId());
			        	cd.setPopulation(d.getPopulation());
			        	coronaDataList.add(cd);
					}
				}
				coronaDataList.add(d);
			});
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

    	List<Series> series = new ArrayList<>();
		territoryMap.keySet().forEach(t -> {
	    	Series s = new Series();
	    	String name = cache.getTerritoryName(t, cds.getLocale());
	    	s.setName(name);
			String color = colorIterator.hasNext() ? colorIterator.next().getHexRGB() : "";
	    	s.setColor(color);
	    	s.setData(new ArrayList<>());
	    	territoryMap.get(t).forEach(d -> {
				log.debug(d.toString());
				double value = 0.0;
	    		switch(cds.getSelectedDataType()) {
	    		default:
	    		case "infections": value = d.getCasesKum().doubleValue(); break;
	    		case "infectionsPerDay": value = d.getCases().doubleValue(); break;
	    		case "infectionsPer100000": value = d.getCasesPer100000Pop(); break;
	    		case "infectionsPerDaysAnd100000": value = d.getCasesDaysKum() * (double)daysToKumPop / d.getPopulation(); break;
	    		case "deaths": value = d.getDeathsKum().doubleValue(); break;
	    		case "deathsPerDay": value = d.getDeaths().doubleValue(); break;
	    		case "deathsPer100000": value = d.getDeathsPer100000Pop(); break;
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

    @GetMapping("/ajax/barGraph")
    public BarChartData getBarGraph(@ModelAttribute CoronaDataSession cds) {
    	BarChartData data = new BarChartData();
    	
		LocalDate selectedDate = cds.getToDate();
		
		List<CoronaData> coronaData = new ArrayList<>();
		if (!CollectionUtils.isEmpty(cds.getSelectedTerritories())) {
			cds.getSelectedTerritories().forEach(t -> {
				LocalDate date = selectedDate;
				Optional<LocalDate> maxDate = repo.getMaxDateRepByTerritory(t);
				if (maxDate.isPresent() && selectedDate.isAfter(maxDate.get())) {
					// get last data if no data available at selected date
					date = maxDate.get();
				}
				List<String> territory = new ArrayList<>();
				territory.add(t);
				repo.findByTerritoryInAndDateRepBetween(territory, date, date).forEach(d -> {
					coronaData.add(d.toCoronaData());
				});
			});
		}
		
    	String title = "";
		switch (cds.getSelectedDataType()) {
		default:
		case "infections":
			title = messageSourceService.getMessage("chart.infections", cds.getLocale());
			coronaData.sort(Comparator.comparing(CoronaData::getCasesKum).reversed());
			break;
		case "infectionsPerDay":
			title = messageSourceService.getMessage("chart.infectionsPerDay", cds.getLocale());
			coronaData.sort(Comparator.comparing(CoronaData::getCases).reversed());
			break;
		case "infectionsPer100000":
			title = messageSourceService.getMessage("chart.infectionsPer100000", cds.getLocale());
			coronaData.sort(Comparator.comparing(CoronaData::getCasesPer100000Pop).reversed());
			break;
		case "infectionsPerDaysAnd100000":
			title = messageSourceService.getMessage("chart.infectionsPerDaysAnd100000", cds.getLocale(), daysToKum);
			coronaData.sort(Comparator.comparing(CoronaData::getCasesDaysKum).reversed());
			break;
		case "deaths":
			title = messageSourceService.getMessage("chart.deaths", cds.getLocale());
			coronaData.sort(Comparator.comparing(CoronaData::getDeathsKum).reversed());
			break;
		case "deathsPerDay":
			title = messageSourceService.getMessage("chart.deathsPerDay", cds.getLocale());
			coronaData.sort(Comparator.comparing(CoronaData::getDeaths).reversed());
			break;
		case "deathsPer100000":
			title = messageSourceService.getMessage("chart.deathsPer100000", cds.getLocale());
			coronaData.sort(Comparator.comparing(CoronaData::getDeathsPer100000Pop).reversed());
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
        	barData.add(cache.getTerritoryName(d.getTerritory(), cds.getLocale()));
        	Double value = 0.0;
    		switch(cds.getSelectedDataType()) {
    		case "infections": value = d.getCasesKum().doubleValue(); break;
    		case "infectionsPerDay": value = d.getCases().doubleValue(); break;
    		case "infectionsPer100000": value = d.getCasesPer100000Pop(); break;
    		case "infectionsPerDaysAnd100000": value = (d.getCasesDaysKum() * (double)daysToKumPop) / d.getPopulation(); break;
    		case "deaths": value = d.getDeathsKum().doubleValue(); break;
    		case "deathsPerDay": value = d.getDeaths().doubleValue(); break;
    		case "deathsPer100000": value = d.getDeathsPer100000Pop(); break;
    		default: value = 0.0; break;
    		}
        	barData.add(value);
        	series.getData().add(barData);
    	});
    	data.setSeries(series);
    	
    	return data;
    }


    @GetMapping("/ajax/stackedBarGraph")
    public StackedBarChartData getStackedBarGraph(@ModelAttribute CoronaDataSession cds) {
    	StackedBarChartData data = new StackedBarChartData();
    	
		Map<String, CoronaData> coronaData = new HashMap<>();
		if (!CollectionUtils.isEmpty(cds.getSelectedTerritories())) {
			cds.getSelectedTerritories().forEach(t -> {
				Optional<CoronaDataEntity> entity;
				switch (cds.getSelectedDataType()) {
				case "infections":
				case "infectionsPerDay":
				case "infectionsPer100000":
				default:
					entity = repo.getFirstByTerritoryAndCasesKumGreaterThanOrderByCasesKumAscDateRepAsc(t, 0L);
					break;
				case "deaths":
				case "deathsPerDay":
				case "deathsPer100000":
					entity = repo.getFirstByTerritoryAndDeathsKumGreaterThanOrderByDeathsKumAscDateRepAsc(t, 0L);
					break;
				}
				if (entity.isPresent()) {
					CoronaDataEntity e = entity.get();
					if (e.getDateRep().isAfter(cds.getFromDate().minusDays(1)) && e.getDateRep().isBefore(cds.getToDate().plusDays(1))) {
						log.debug("{}", e.toString());
						coronaData.put(e.getTerritory(), e.toCoronaData());
					}
				}
			});
		}

		AtomicBoolean infections = new AtomicBoolean();
    	String title = "";
    	String yAxisTitle = "";
		switch (cds.getSelectedDataType()) {
		case "infections":
		case "infectionsPerDay":
		case "infectionsPer100000":
		default:
			title = messageSourceService.getMessage("chart.startOfInfections", cds.getLocale());
			yAxisTitle = messageSourceService.getMessage("chart.infections", cds.getLocale());
			infections.set(true);
			break;
		case "deaths":
		case "deathsPerDay":
		case "deathsPer100000":
			title = messageSourceService.getMessage("chart.startOfDeaths", cds.getLocale());
			yAxisTitle = messageSourceService.getMessage("chart.deaths", cds.getLocale());
			infections.set(false);
			break;
		}
    	data.setTitle(title);
    	
    	YAxis yAxis = new YAxis();
    	yAxis.setTitle(yAxisTitle);
    	yAxis.setType(cds.getSelectedYAxisType());
    	data.setYAxis(yAxis);
    	
    	List<String> dates = new ArrayList<>();
        for (LocalDate date = cds.getFromDate(); date.isBefore(cds.getToDate().plusDays(1)); date=date.plusDays(1)) {
        	dates.add(date.format(DateTimeFormatter.ofPattern("dd.MM.")));
        }
    	XAxis xAxis = new XAxis();
    	xAxis.setTitle(messageSourceService.getMessage("date", cds.getLocale()));
    	xAxis.setDates(dates);
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
        			if (infections.get()) {
            			series.getData().add(cd.getCases().doubleValue());
        			} else {
            			series.getData().add(cd.getDeaths().doubleValue());
        			}
        		} else {
        			series.getData().add(0.0);
        		}
        	}
            data.getSeries().add(series);
    	});
    	
    	return data;
    }
    
    @GetMapping("/ajax/infectionsDeathsGraph")
    public LineChartData getInfectionsDeathsGraph(@ModelAttribute CoronaDataSession cds) {
    	LineChartData data = new LineChartData();

    	String title = "";
    	String title1 = "";
    	String title2 = "";
		switch(cds.getSelectedDataType()) {
		default:
		case "infections":
		case "deaths":
			title = messageSourceService.getMessage("chart.infectionsAndDeaths", cds.getLocale());
			title1 = messageSourceService.getMessage("chart.infections", cds.getLocale());
			title2 = messageSourceService.getMessage("chart.deaths", cds.getLocale());
			break;
		case "infectionsPerDay":
		case "deathsPerDay":
			title = messageSourceService.getMessage("chart.infectionsAndDeathsPerDay", cds.getLocale());
			title1 = messageSourceService.getMessage("chart.infectionsPerDay", cds.getLocale());
			title2 = messageSourceService.getMessage("chart.deathsPerDay", cds.getLocale());
			break;
		case "infectionsPer100000":
		case "deathsPer100000":
			title = messageSourceService.getMessage("chart.infectionsAndDeathsPer100000", cds.getLocale());
			title1 = messageSourceService.getMessage("chart.infectionsPer100000", cds.getLocale());
			title2 = messageSourceService.getMessage("chart.deathsPer100000", cds.getLocale());
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
			List<CoronaData> coronaData = new ArrayList<>();
			repo.findByTerritoryInAndDateRepBetween(cds.getSelectedTerritories(), cds.getFromDate(), cds.getToDate()).forEach(d -> {
				coronaData.add(d.toCoronaData());
			});
			coronaData.sort(Comparator.comparing(CoronaData::getDateRep));
			coronaData.forEach(d -> { 
				List<CoronaData> coronaDataList = territoryMap.get(d.getTerritory());
				LocalDate lastDate;
				if (coronaDataList == null) {
					coronaDataList = new ArrayList<>();
					if (d.getDateRep().isAfter(cds.getFromDate())) {
						CoronaData cd;
				        for (LocalDate date = cds.getFromDate(); date.isBefore(d.getDateRep()); date=date.plusDays(1)) {
				        	cd = new CoronaData();
				        	cd.setDateRep(date);
				        	cd.setTerritory(d.getTerritory());
				        	cd.setTerritoryCode(d.getTerritoryCode());
				        	cd.setTerritoryParent(d.getTerritoryParent());
				        	cd.setCases(0L);
				        	cd.setCasesKum(0L);
				        	cd.setCasesPer100000Pop(0.0);
				        	cd.setDeaths(0L);
				        	cd.setDeathsKum(0L);
				        	cd.setDeathsPer100000Pop(0.0);
				        	cd.setGeoId(d.getGeoId());
				        	cd.setPopulation(d.getPopulation());
				        	coronaDataList.add(cd);
				        	lastDate = date;
				        }
					}
					territoryMap.put(d.getTerritory(), coronaDataList);
				}
				if (coronaDataList.size() > 0) {
					lastDate = coronaDataList.get(coronaDataList.size()-1).getDateRep();
					CoronaData cd;
					for (LocalDate day = lastDate.plusDays(1L); day.isBefore(d.getDateRep()); day = day.plusDays(1)) {
			        	cd = new CoronaData();
			        	cd.setDateRep(day);
			        	cd.setTerritory(d.getTerritory());
			        	cd.setTerritoryCode(d.getTerritoryCode());
			        	cd.setTerritoryParent(d.getTerritoryParent());
			        	cd.setCases(0L);
			        	cd.setCasesKum(d.getCasesKum());
			        	cd.setCasesPer100000Pop(d.getCasesPer100000Pop());
			        	cd.setDeaths(0L);
			        	cd.setDeathsKum(d.getDeathsKum());
			        	cd.setDeathsPer100000Pop(d.getDeathsPer100000Pop());
			        	cd.setGeoId(d.getGeoId());
			        	cd.setPopulation(d.getPopulation());
			        	coronaDataList.add(cd);
					}
				}
				coronaDataList.add(d);
			});
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
    	
    	List<Series> series = new ArrayList<>();
		territoryMap.keySet().forEach(tk -> {
			String color = colorIterator.hasNext() ? colorIterator.next().getHexRGB() : "";
			
	    	Series i = new Series();
	    	i.setName(cache.getTerritoryName(tk, cds.getLocale()) + " - " + messageSourceService.getMessage("chart.infections", cds.getLocale()));
	    	i.setColor(color);
	    	i.setData(new ArrayList<>());
	    	
	    	Series d = new Series();
	    	d.setName(cache.getTerritoryName(tk, cds.getLocale()) + " - " + messageSourceService.getMessage("chart.deaths", cds.getLocale()));
	    	d.setYAxis(1);
	    	d.setDashStyle("ShortDash");
	    	d.setColor(color);
	    	d.setData(new ArrayList<>());
	    	
	    	territoryMap.get(tk).forEach(t -> {
				log.debug(t.toString());
				double iValue = 0.0;
				double dValue = 0.0;
	    		switch(cds.getSelectedDataType()) {
				case "infections":
				case "deaths":
				default:
					iValue = t.getCasesKum().doubleValue();
					dValue = t.getDeathsKum().doubleValue();
					break;
				case "infectionsPerDay":
				case "deathsPerDay":
					iValue = t.getCases().doubleValue();
					dValue = t.getDeaths().doubleValue();
					break;
				case "infectionsPer100000":
				case "deathsPer100000":
					iValue = t.getCasesPer100000Pop();
					dValue = t.getDeathsPer100000Pop();
					break;
	    		}
				i.getData().add(iValue);
				d.getData().add(dValue);
	    		
		    	if ("linear".equals(yAxis.getType())) {
		    		yAxis.setMin(0.0);
		    	} else {
		    		if (yAxis.getMin1() == null) {
		    			yAxis.setMin1(1.0);
		    		}
		    		if (yAxis.getMin2() == null) {
		    			yAxis.setMin2(1.0);
		    		}
		    		
		    		if (yAxis.getMin1() > iValue && iValue > 0.0) {
		    			yAxis.setMin1(iValue);
		    		}		    		
		    		if (yAxis.getMin2() > dValue && dValue > 0.0) {
		    			yAxis.setMin2(dValue);
		    		}
		    	}
	    	});
	    	series.add(i);
	    	series.add(d);
		});
    	data.setSeries(series);
    	
        return data;
    }

    @GetMapping("/ajax/bubbleGraph")
    public BubbleChartData getBubbleGraph(@ModelAttribute CoronaDataSession cds) {
    	BubbleChartData data = new BubbleChartData();

    	String title = "";
		switch(cds.getSelectedDataType()) {
		default:
		case "infections": title = messageSourceService.getMessage("chart.infections", cds.getLocale()); break;
		case "infectionsPerDay": title = messageSourceService.getMessage("chart.infectionsPerDay", cds.getLocale()); break;
		case "infectionsPer100000": title = messageSourceService.getMessage("chart.infectionsPer100000", cds.getLocale()); break;
		case "deaths": title = messageSourceService.getMessage("chart.deaths", cds.getLocale()); break;
		case "deathsPerDay": title = messageSourceService.getMessage("chart.deathsPerDay", cds.getLocale()); break;
		case "deathsPer100000": title = messageSourceService.getMessage("chart.deathsPer100000", cds.getLocale()); break;
		}
    	
    	data.setTitle(messageSourceService.getMessage("chart.historicalBubbles", cds.getLocale()));
    	data.setSubTitle(title);
    	
    	YAxis yAxis = new YAxis();
    	yAxis.setTitle(title);
    	yAxis.setType(cds.getSelectedYAxisType());
    	data.setYAxis(yAxis);
    	
    	Map<String,List<CoronaData>> territoryMap = new HashMap<>();
		if (!CollectionUtils.isEmpty(cds.getSelectedTerritories())) {
			List<CoronaData> coronaData = new ArrayList<>();
			repo.findByTerritoryInAndDateRepBetween(cds.getSelectedTerritories(), cds.getFromDate(), cds.getToDate()).forEach(d -> {
				coronaData.add(d.toCoronaData());
			});
			coronaData.sort(Comparator.comparing(CoronaData::getDateRep));
			coronaData.forEach(d -> { 
				List<CoronaData> coronaDataList = territoryMap.get(d.getTerritory());
				LocalDate lastDate;
				if (coronaDataList == null) {
					coronaDataList = new ArrayList<>();
					if (d.getDateRep().isAfter(cds.getFromDate())) {
						CoronaData cd;
				        for (LocalDate date = cds.getFromDate(); date.isBefore(d.getDateRep()); date=date.plusDays(1)) {
				        	cd = new CoronaData();
				        	cd.setDateRep(date);
				        	cd.setTerritory(d.getTerritory());
				        	cd.setTerritoryCode(d.getTerritoryCode());
				        	cd.setTerritoryParent(d.getTerritoryParent());
				        	cd.setCases(0L);
				        	cd.setCasesKum(0L);
				        	cd.setCasesPer100000Pop(0.0);
				        	cd.setDeaths(0L);
				        	cd.setDeathsKum(0L);
				        	cd.setDeathsPer100000Pop(0.0);
				        	cd.setGeoId(d.getGeoId());
				        	cd.setPopulation(d.getPopulation());
				        	coronaDataList.add(cd);
				        	lastDate = date;
				        }
					}
					territoryMap.put(d.getTerritory(), coronaDataList);
				}
				if (coronaDataList.size() > 0) {
					lastDate = coronaDataList.get(coronaDataList.size()-1).getDateRep();
					CoronaData cd;
					for (LocalDate day = lastDate.plusDays(1L); day.isBefore(d.getDateRep()); day = day.plusDays(1)) {
			        	cd = new CoronaData();
			        	cd.setDateRep(day);
			        	cd.setTerritory(d.getTerritory());
			        	cd.setTerritoryCode(d.getTerritoryCode());
			        	cd.setTerritoryParent(d.getTerritoryParent());
			        	cd.setCases(0L);
			        	cd.setCasesKum(d.getCasesKum());
			        	cd.setCasesPer100000Pop(d.getCasesPer100000Pop());
			        	cd.setDeaths(0L);
			        	cd.setDeathsKum(d.getDeathsKum());
			        	cd.setDeathsPer100000Pop(d.getDeathsPer100000Pop());
			        	cd.setGeoId(d.getGeoId());
			        	cd.setPopulation(d.getPopulation());
			        	coronaDataList.add(cd);
					}
				}
				coronaDataList.add(d);
			});
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
				switch (cds.getSelectedDataType()) {
				default:
				case "infections":
					y = d.getCasesKum().doubleValue();
					z = d.getCases().doubleValue();
					break;
				case "infectionsPerDay":
					y = d.getCases().doubleValue();
					z = d.getCases().doubleValue();
					break;
				case "infectionsPer100000":
					y = d.getCasesPer100000Pop();
					z = d.getCases().doubleValue();
					break;
				case "deaths":
					y = d.getDeathsKum().doubleValue();
					z = d.getDeaths().doubleValue();
					break;
				case "deathsPerDay":
					y = d.getDeaths().doubleValue();
					z = d.getDeaths().doubleValue();
					break;
				case "deathsPer100000":
					y = d.getDeathsPer100000Pop();
					z = d.getDeaths().doubleValue();
					break;
				}
				Bubble bubble = new Bubble(x.get(), y, z, cache.getTerritoryName(t, cds.getLocale()), dates.get(x.get()));
				s.getData().add(bubble);
				x.incrementAndGet();
	    		
		    	if ("linear".equals(yAxis.getType())) {
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
}
