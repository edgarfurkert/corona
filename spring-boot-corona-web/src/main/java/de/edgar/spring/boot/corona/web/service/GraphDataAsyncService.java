package de.edgar.spring.boot.corona.web.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import de.edgar.spring.boot.corona.web.jpa.CoronaDataJpaRepository;
import de.edgar.spring.boot.corona.web.model.CoronaData;
import de.edgar.spring.boot.corona.web.model.CoronaDataSession;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class GraphDataAsyncService {

	@Value( "${corona.data.daysToKum}" )
	private Integer daysToKum;

	@Value( "${corona.data.daysToKumPop}" )
	private Long daysToKumPop;

	@Autowired
	private CoronaDataJpaRepository repo;
	
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


	@Async
	public CompletableFuture<Map<String,List<CoronaData>>> getHistoricalDataAsync(List<String> territorys, CoronaDataSession cds, LocalDate fromDate) {
		//log.info("getHistoricalDataAsync: thread {}", Thread.currentThread().getName());
		Map<String,List<CoronaData>> territoryMap = new HashMap<>();
		
		repo.findByTerritoryIdInAndDateRepBetweenOrderByDateRep(territorys, fromDate, cds.getToDate()).forEach(e -> {		
			CoronaData d = e.toCoronaData();
			if (!cds.getSelectedTerritoryParents().contains(d.getTerritoryParent())) {
				return;
			}
			List<CoronaData> coronaDataList = territoryMap.get(d.getTerritoryId());
			d.setCasesDaysPer100000Pop(getCasesPerDaysAnd100000(d));

			LocalDate lastDate;
			if (coronaDataList == null) {
				coronaDataList = new ArrayList<>();
				if (d.getDateRep().isAfter(fromDate)) {
					CoronaData cd;
			        for (LocalDate date = fromDate; date.isBefore(d.getDateRep()); date=date.plusDays(1)) {
			        	cd = new CoronaData();
			        	cd.setDateRep(date);
			        	cd.setTerritoryId(d.getTerritoryId());
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
			        	cd.setRecovered(0L);
			        	cd.setRecoveredKum(0L);
			        	cd.setRecoveredPer100000Pop(0.0);
			        	cd.setActive(0L);
			        	cd.setActiveKum(0L);
			        	cd.setActivePer100000Pop(0.0);
			        	cd.setGeoId(d.getGeoId());
			        	cd.setPopulation(d.getPopulation());
			        	cd.setFirstVaccinations(d.getFirstVaccinations());
			        	cd.setFirstVaccinationsKum(d.getFirstVaccinationsKum());
			        	cd.setFirstVaccinationsPer100000Pop(d.getFirstVaccinationsPer100000Pop());			        	
			        	cd.setFullVaccinations(d.getFullVaccinations());
			        	cd.setFullVaccinationsKum(d.getFullVaccinationsKum());
			        	cd.setFullVaccinationsPer100000Pop(d.getFullVaccinationsPer100000Pop());			        	
			        	cd.setTotalVaccinations(d.getTotalVaccinations());
			        	cd.setTotalVaccinationsKum(d.getTotalVaccinationsKum());
			        	cd.setTotalVaccinationsPer100000Pop(d.getTotalVaccinationsPer100000Pop());			        	
			        	coronaDataList.add(cd);
			        	lastDate = date;
			        	log.debug("getHistoricalData: {} - {}", date, cd.getPopulation());
			        }
				}
				territoryMap.put(d.getTerritoryId(), coronaDataList);
			}
			if (coronaDataList.size() > 0) {
				lastDate = coronaDataList.get(coronaDataList.size()-1).getDateRep();
				CoronaData cd;
				for (LocalDate day = lastDate.plusDays(1L); day.isBefore(d.getDateRep()); day = day.plusDays(1)) {
		        	cd = new CoronaData();
		        	cd.setDateRep(day);
		        	cd.setTerritoryId(d.getTerritoryId());
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
		        	cd.setRecovered(0L);
		        	cd.setRecoveredKum(d.getRecoveredKum());
		        	cd.setRecoveredPer100000Pop(d.getRecoveredPer100000Pop());
		        	cd.setActive(0L);
		        	cd.setActiveKum(d.getActiveKum());
		        	cd.setActivePer100000Pop(d.getActivePer100000Pop());
		        	cd.setGeoId(d.getGeoId());
		        	cd.setPopulation(d.getPopulation());
		        	cd.setFirstVaccinations(d.getFirstVaccinations());
		        	cd.setFirstVaccinationsKum(d.getFirstVaccinationsKum());
		        	cd.setFirstVaccinationsPer100000Pop(d.getFirstVaccinationsPer100000Pop());			        	
		        	cd.setFullVaccinations(d.getFullVaccinations());
		        	cd.setFullVaccinationsKum(d.getFullVaccinationsKum());
		        	cd.setFullVaccinationsPer100000Pop(d.getFullVaccinationsPer100000Pop());			        	
		        	cd.setTotalVaccinations(d.getTotalVaccinations());
		        	cd.setTotalVaccinationsKum(d.getTotalVaccinationsKum());
		        	cd.setTotalVaccinationsPer100000Pop(d.getTotalVaccinationsPer100000Pop());			        	
		        	coronaDataList.add(cd);
		        	log.debug("getHistoricalData: {} - {}", day, cd.getPopulation());
				}
			}
			coronaDataList.add(d);
		});
		
		calcDaysPer100000(cds, territoryMap);

		return CompletableFuture.completedFuture(territoryMap);
	}

	private double getCasesPerDaysAnd100000(CoronaData d) {
		return getDouble(d.getPopulation()) > 0L ? (getDouble(d.getCasesDaysKum()) * (double)daysToKumPop / d.getPopulation()) : 0.0;
	}

	private double getDeathsPerDaysAnd100000(CoronaData d) {
		return getDouble(d.getPopulation()) > 0L ? (getDouble(d.getDeathsDaysKum()) * (double)daysToKumPop / d.getPopulation()) : 0.0;
	}

	private double getRecoveredPerDaysAnd100000(CoronaData d) {
		return getDouble(d.getPopulation()) > 0L ? (getDouble(d.getRecoveredDaysKum()) * (double)daysToKumPop / d.getPopulation()) : 0.0;
	}

	private double getActivePerDaysAnd100000(CoronaData d) {
		return getDouble(d.getPopulation()) > 0L ? (getDouble(d.getActiveDaysKum()) * (double)daysToKumPop / d.getPopulation()) : 0.0;
	}

	private void calcDaysPer100000(CoronaDataSession cds, Map<String,List<CoronaData>> territoryMap) {
		if (!"perDaysAnd100000".equals(cds.getSelectedDataCategory())) {
			return;
		}
		
		if ("infectionsAnd".equals(cds.getSelectedGraphType()) && !"infections".equals(cds.getSelectedDataType())) {
			calcDaysPer100000(cds, territoryMap);
		}
		
		List<Long> valueList = new ArrayList<Long>();
		AtomicLong sum = new AtomicLong();
		territoryMap.keySet().forEach(t -> {
			List<CoronaData> cdList = territoryMap.get(t);
			int c = 0;
			CoronaData coronaData, clone;
			try {
				for (LocalDate date = cds.getFromDate().minusDays(daysToKum); date.isBefore(cds.getToDate().plusDays(1)); date = date.plusDays(1)) {
					if (c >= cdList.size()) {
						clone = cdList.get(c-1).clone();
						clone.setDateRep(date);
						clone.setActive(0L);
						clone.setCases(0L);
						clone.setDeaths(0L);
						clone.setRecovered(0L);
						clone.setFirstVaccinations(0L);
						clone.setFullVaccinations(0L);
						clone.setTotalVaccinations(0L);
						cdList.add(c, clone);
					}
					coronaData = cdList.get(c);
					if (!coronaData.getDateRep().equals(date)) {
						clone = coronaData.clone();
						clone.setDateRep(date);
						clone.setActive(0L);
						clone.setCases(0L);
						clone.setDeaths(0L);
						clone.setRecovered(0L);
						clone.setFirstVaccinations(0L);
						clone.setFullVaccinations(0L);
						clone.setTotalVaccinations(0L);
						cdList.add(c, clone);
					}
					c++;
				}
			} catch (CloneNotSupportedException e) {
				log.error("calcDaysPer100000: {}", e);
				return;
			}
			cdList.forEach(cd -> {
				Long value = null;
				switch (cds.getSelectedDataType()) {
				case "infections":
					value = cd.getCases();
					log.debug("cases: {} {} - {}", cd.getTerritoryId(), cd.getDateRep(), value);
					if (valueList.size() == daysToKum) {
						cd.setCasesDaysKum(sum.get());
						cd.setCasesDaysPer100000Pop(getCasesPerDaysAnd100000(cd));
						log.debug("cases: {} - {}, {}, {}", cd.getDateRep(), cd.getCasesDaysKum(), cd.getCasesDaysPer100000Pop(), cd.getPopulation());
						sum.addAndGet(valueList.remove(0) * -1l);
					}
					break;
				case "deaths": 
					value = cd.getDeaths();
					log.debug("deaths: {} {} - {}", cd.getTerritoryId(), cd.getDateRep(), value);
					if (valueList.size() == daysToKum) {
						cd.setDeathsDaysKum(sum.get());
						cd.setDeathsDaysPer100000Pop(getDeathsPerDaysAnd100000(cd));
						log.debug("deaths: {} - {}, {}, {}", cd.getDateRep(), cd.getDeathsDaysKum(), cd.getDeathsDaysPer100000Pop(), cd.getPopulation());
						sum.addAndGet(valueList.remove(0) * -1l);
					}
					break;
				case "recovered": 
					value = cd.getRecovered();
					log.debug("recovered: {} {} - {}", cd.getTerritoryId(), cd.getDateRep(), value);
					if (valueList.size() == daysToKum) {
						cd.setRecoveredDaysKum(sum.get());
						cd.setRecoveredDaysPer100000Pop(getRecoveredPerDaysAnd100000(cd));
						log.debug("recovered: {} - {}, {}, {}", cd.getDateRep(), cd.getRecoveredDaysKum(), cd.getRecoveredDaysPer100000Pop(), cd.getPopulation());
						sum.addAndGet(valueList.remove(0) * -1l);
					}
					break;
				case "active": 
					value = cd.getActive();
					log.debug("active: {} {} - {}", cd.getTerritoryId(), cd.getDateRep(), value);
					if (valueList.size() == daysToKum) {
						cd.setActiveDaysKum(sum.get());
						cd.setActiveDaysPer100000Pop(getActivePerDaysAnd100000(cd));
						log.debug("active: {} - {}, {}, {}", cd.getDateRep(), cd.getActiveDaysKum(), cd.getActiveDaysPer100000Pop(), cd.getPopulation());
						sum.addAndGet(valueList.remove(0) * -1l);
					}
					break;
				/*
				case "vaccinationFirst": 
					value = cd.getFirstVaccinations();
					log.debug("active: {} {} - {}", cd.getTerritoryId(), cd.getDateRep(), value);
					if (valueList.size() == daysToKum) {
						cd.setFirstVaccinationsDaysKum(sum.get());
						cd.setFirstVaccinationsDaysPer100000Pop(getFirstVaccinationsPerDaysAnd100000(cd));
						log.debug("active: {} - {}, {}, {}", cd.getDateRep(), cd.getFirstVaccinationsDaysKum(), cd.getFirstVaccinationsDaysPer100000Pop(), cd.getPopulation());
						sum.addAndGet(valueList.remove(0) * -1l);
					}
					break;
				*/
				}
				sum.addAndGet(value);
				valueList.add(value);
			});
			for (int i = 0; i < daysToKum; i++) {
				cdList.remove(0);
			}
		});
	}

}
