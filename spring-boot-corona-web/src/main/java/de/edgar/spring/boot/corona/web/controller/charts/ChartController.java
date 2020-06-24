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
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.SessionAttributes;

import de.edgar.spring.boot.corona.web.cache.CoronaDataCache;
import de.edgar.spring.boot.corona.web.config.ColorProperties;
import de.edgar.spring.boot.corona.web.config.ColorProperty;
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
import de.edgar.spring.boot.corona.web.model.charts.XAxis;
import de.edgar.spring.boot.corona.web.model.charts.YAxis;
import lombok.extern.slf4j.Slf4j;

/**
 * User: gardiary
 * Date: 12/11/17, 21:31
 */
@Slf4j
@RestController
@SessionAttributes("coronaDataSession")
public class ChartController {

	@Autowired
	private CoronaDataJpaRepository repo;
	
	@Autowired
	private ColorProperties colorProps;
	
	@Autowired
	private CoronaDataCache cache;

    @GetMapping("/ajax/lineGraph")
    public LineChartData getLineGraph(@ModelAttribute CoronaDataSession cds) {
    	LineChartData data = new LineChartData();

    	String title = "";
		switch(cds.getSelectedDataType()) {
		case "infections": title = "Infections"; break;
		case "infectionsPerDay": title = "Infections/day"; break;
		case "infectionsPer100000": title = "Infections/100.000 population"; break;
		case "deaths": title = "Deaths"; break;
		case "deathsPerDay": title = "Deaths/day"; break;
		case "deathsPer100000": title = "Deaths/100.000 population"; break;
		default: title = "Infections"; break;
		}
    	
    	data.setTitle("Historical Chart");
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
    	xAxis.setTitle("Date");
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
	    	String name = cache.getTerritoryName(t);
	    	s.setName(name);
			String color = colorIterator.hasNext() ? colorIterator.next().getHexRGB() : "";
	    	s.setColor(color);
	    	s.setData(new ArrayList<>());
	    	territoryMap.get(t).forEach(d -> {
				log.debug(d.toString());
	    		switch(cds.getSelectedDataType()) {
	    		case "infections": s.getData().add(d.getCasesKum().doubleValue()); break;
	    		case "infectionsPerDay": s.getData().add(d.getCases().doubleValue()); break;
	    		case "infectionsPer100000": s.getData().add(d.getCasesPer100000Pop()); break;
	    		case "deaths": s.getData().add(d.getDeathsKum().doubleValue()); break;
	    		case "deathsPerDay": s.getData().add(d.getDeaths().doubleValue()); break;
	    		case "deathsPer100000": s.getData().add(d.getDeathsPer100000Pop()); break;
	    		default: s.getData().add(d.getCasesKum().doubleValue()); break;
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
		case "infections":
			title = "Infections";
			coronaData.sort(Comparator.comparing(CoronaData::getCasesKum).reversed());
			break;
		case "infectionsPerDay":
			title = "Infections/day";
			coronaData.sort(Comparator.comparing(CoronaData::getCases).reversed());
			break;
		case "infectionsPer100000":
			title = "Infections/100.000 population";
			coronaData.sort(Comparator.comparing(CoronaData::getCasesPer100000Pop).reversed());
			break;
		case "deaths":
			title = "Deaths";
			coronaData.sort(Comparator.comparing(CoronaData::getDeathsKum).reversed());
			break;
		case "deathsPerDay":
			title = "Deaths/day";
			coronaData.sort(Comparator.comparing(CoronaData::getDeaths).reversed());
			break;
		case "deathsPer100000":
			title = "Deaths/100.000 population";
			coronaData.sort(Comparator.comparing(CoronaData::getDeathsPer100000Pop).reversed());
			break;
		default:
			title = "Infections";
			coronaData.sort(Comparator.comparing(CoronaData::getCasesKum).reversed());
			break;
		}
				
    	data.setTitle("Top 25 Chart");
    	data.setSubTitle(selectedDate.format(DateTimeFormatter.ofPattern("dd.MM.yyyy")));
    	
    	YAxis yAxis = new YAxis();
    	yAxis.setTitle(title);
    	yAxis.setType(cds.getSelectedYAxisType());
    	data.setYAxis(yAxis);
    	
    	XAxis xAxis = new XAxis();
    	xAxis.setTitle("Region");
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
        	barData.add(cache.getTerritoryName(d.getTerritory()));
        	Double value = 0.0;
    		switch(cds.getSelectedDataType()) {
    		case "infections": value = d.getCasesKum().doubleValue(); break;
    		case "infectionsPerDay": value = d.getCases().doubleValue(); break;
    		case "infectionsPer100000": value = d.getCasesPer100000Pop(); break;
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

    @GetMapping("/ajax/infectionsDeathsGraph")
    public LineChartData getInfectionsDeathsGraph(@ModelAttribute CoronaDataSession cds) {
    	LineChartData data = new LineChartData();

    	String title = "";
    	String title1 = "";
    	String title2 = "";
		switch(cds.getSelectedDataType()) {
		case "infections":
		case "deaths":
			title = "Infections and Deaths";
			title1 = "Infections";
			title2 = "Deaths";
			break;
		case "infectionsPerDay":
		case "deathsPerDay":
			title = "Infections, deaths per day";
			title1 = "Infections / day";
			title2 = "Deaths / day";
			break;
		case "infectionsPer100000":
		case "deathsPer100000":
			title = "Infections, deaths per 100.000 population";
			title1 = "Infections / 100.000 population";
			title2 = "Deaths / 100.000 population";
			break;
		default:
			title = "Infections and Deaths";
			title1 = "Infections";
			title2 = "Deaths";
			break;
		}
    	
    	data.setTitle("Infections and Deaths Chart");
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
    	xAxis.setTitle("Date");
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
	    	i.setName(cache.getTerritoryName(tk) + " - Infections");
	    	i.setColor(color);
	    	i.setData(new ArrayList<>());
	    	
	    	Series d = new Series();
	    	d.setName(cache.getTerritoryName(tk) + " - Deaths");
	    	d.setYAxis(1);
	    	d.setDashStyle("ShortDash");
	    	d.setColor(color);
	    	d.setData(new ArrayList<>());
	    	
	    	territoryMap.get(tk).forEach(t -> {
				log.debug(t.toString());
	    		switch(cds.getSelectedDataType()) {
				case "infections":
				case "deaths":
					i.getData().add(t.getCasesKum().doubleValue());
					d.getData().add(t.getDeathsKum().doubleValue());
					break;
				case "infectionsPerDay":
				case "deathsPerDay":
					i.getData().add(t.getCases().doubleValue());
					d.getData().add(t.getDeaths().doubleValue());
					break;
				case "infectionsPer100000":
				case "deathsPer100000":
					i.getData().add(t.getCasesPer100000Pop());
					d.getData().add(t.getDeathsPer100000Pop());
					break;
				default:
					i.getData().add(t.getCasesKum().doubleValue());
					d.getData().add(t.getDeathsKum().doubleValue());
					break;
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
		case "infections": title = "Infections"; break;
		case "infectionsPerDay": title = "Infections/day"; break;
		case "infectionsPer100000": title = "Infections/100.000 population"; break;
		case "deaths": title = "Deaths"; break;
		case "deathsPerDay": title = "Deaths/day"; break;
		case "deathsPer100000": title = "Deaths/100.000 population"; break;
		default: title = "Infections"; break;
		}
    	
    	data.setTitle("Historical Bubble Chart");
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
    	xAxis.setTitle("Date");
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
			s.setName(cache.getTerritoryName(t));
			String color = colorIterator.hasNext() ? colorIterator.next().getHexRGB() : "";
	    	s.setColor(color);
	    	s.setData(new ArrayList<>());
	    	AtomicInteger x = new AtomicInteger();
	    	territoryMap.get(t).forEach(d -> {
				log.debug(d.toString());
				Double y;
				Double z;
				switch (cds.getSelectedDataType()) {
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
				default:
					y = d.getCasesKum().doubleValue();
					z = d.getCases().doubleValue();
					break;
				}
				Bubble bubble = new Bubble(x.get(), y, z, cache.getTerritoryName(t), dates.get(x.get()));
				s.getData().add(bubble);
				x.incrementAndGet();
	    	});
	    	series.add(s);
		});
    	data.setSeries(series);
    	
        return data;
    }
}
