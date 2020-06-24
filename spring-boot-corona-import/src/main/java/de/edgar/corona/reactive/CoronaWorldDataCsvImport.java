package de.edgar.corona.reactive;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import de.edgar.corona.config.TerritoryProperties;
import de.edgar.corona.jpa.CoronaDataEntity;
import de.edgar.corona.jpa.CoronaDataJpaRepository;
import de.edgar.corona.model.CoronaWorldData;
import de.edgar.corona.model.OrderIdEnum;
import de.edgar.corona.model.Territory;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Flux;

@Slf4j
@Component
public class CoronaWorldDataCsvImport extends CoronaDataCsvImport {
	
	@Autowired
	private TerritoryProperties territoryProps;
	
	public CoronaWorldDataCsvImport(CoronaDataJpaRepository repository) {
		this.repository = repository;
	}

	public void importData(String fileName) {
		log.info("Importing file " + fileName);
		Map<String, CoronaWorldData> kummulativeDataMap = Collections.synchronizedMap(new HashMap<>());
		Map<String, LocalDate> territoryLatestDateRepMap = Collections.synchronizedMap(new HashMap<>());
		Map<String, Map<String, CoronaWorldData>> territoryParentMap = Collections.synchronizedMap(new HashMap<>());
		
		Path path = Paths.get(fileName);
		
		// check update file
		fileName = path.getFileName().toString();
		AtomicBoolean filterDisabled = new AtomicBoolean(updateCheckService.checkUpdateFile(path.getParent().toString(), fileName, true));
		
		Flux<CoronaDataEntity> file = 
				FluxFileReader.fromPath(path)
						  .skip(1) // skip header
						  .map(l -> { return new CoronaWorldData(l); })
						  .sort((c1, c2) -> c1.getDateRep().compareTo(c2.getDateRep()))
						  .doOnNext(m -> {
								String territoryKey = m.getTerritory();
								CoronaWorldData c = kummulativeDataMap.get(territoryKey);
								if (c != null) {
									m.setCasesKum(m.getCases() + (c.getCasesKum() != null ? c.getCasesKum() : 0L));
									m.setDeathsKum(m.getDeaths() + (c.getDeathsKum() != null ? c.getDeathsKum() : 0L));
									if (m.getPopulation() > 0) {
										m.setCasesPer100000Pop((m.getCasesKum() * 100000.0) / m.getPopulation().doubleValue());
										m.setDeathsPer100000Pop((m.getDeathsKum() * 100000.0) / m.getPopulation().doubleValue());
									} else {
										m.setCasesPer100000Pop(0.0);
										m.setDeathsPer100000Pop(0.0);
									}
								}
								kummulativeDataMap.put(territoryKey, m);
								
								// collect territory parent and world population data
								String worldKey = "World";
								Territory territory = territoryProps.findByKey(territoryKey);
								String orgTerritoryParent = m.getTerritoryParent();
								if (territory != null) {
									m.setTerritoryParent(territory.getTerritoryParent());
								}
								
								String territoryParentKey = m.getTerritoryParent();
								Map<String, CoronaWorldData> territoryParentPopulationMap = territoryParentMap.get(territoryParentKey);
								if (territoryParentPopulationMap == null) {
									territoryParentPopulationMap = Collections.synchronizedMap(new HashMap<>());
									territoryParentMap.put(territoryParentKey, territoryParentPopulationMap);
								}
								
								// handle territory parent population data
								String dateRepKey = m.getDateRep().toString();
								c = territoryParentPopulationMap.get(dateRepKey);
								if (c == null) {
									try {
										c = m.clone();
										c.setGeoId(m.getTerritoryParent());
										c.setTerritory(m.getTerritoryParent());
										c.setTerritoryCode(m.getTerritoryParent());
										c.setTerritoryParent(territory != null ? orgTerritoryParent : worldKey);
										territoryParentPopulationMap.put(dateRepKey, c);
									} catch (CloneNotSupportedException e) {
										log.error("Cannot clone: {}", m);
									}
								} else {
									c.setCases(c.getCases() + m.getCases());
									c.setDeaths(c.getDeaths() + m.getDeaths());
									c.setPopulation(c.getPopulation() + m.getPopulation());
								}
								log.debug(c.getTerritoryParent() + ": " + c.toString());
								
								// handle changed territory parent data
								if (!orgTerritoryParent.equals(m.getTerritoryParent())) {
									territoryParentPopulationMap = territoryParentMap.get(orgTerritoryParent);
									if (territoryParentPopulationMap == null) {
										territoryParentPopulationMap = Collections.synchronizedMap(new HashMap<>());
										territoryParentMap.put(orgTerritoryParent, territoryParentPopulationMap);
									}
									c = territoryParentPopulationMap.get(dateRepKey);
									if (c == null) {
										try {
											c = m.clone();
											c.setGeoId(orgTerritoryParent);
											c.setTerritory(orgTerritoryParent);
											c.setTerritoryCode(orgTerritoryParent);
											c.setTerritoryParent(worldKey);
											c.setOrderId(OrderIdEnum.WORLD.getOrderId());
											territoryParentPopulationMap.put(dateRepKey, c);
										} catch (CloneNotSupportedException e) {
											log.error("Cannot clone: {}", m);
										}
									} else {
										c.setCases(c.getCases() + m.getCases());
										c.setDeaths(c.getDeaths() + m.getDeaths());
										c.setPopulation(c.getPopulation() + m.getPopulation());
									}
									log.debug(c.getTerritoryParent() + ": " + c.toString());
								}
								
								// handle world data
								territoryParentPopulationMap = territoryParentMap.get(worldKey);
								if (territoryParentPopulationMap == null) {
									territoryParentPopulationMap = Collections.synchronizedMap(new HashMap<>());
									territoryParentMap.put(worldKey, territoryParentPopulationMap);
								}
								c = territoryParentPopulationMap.get(dateRepKey);
								if (c == null) {
									try {
										c = m.clone();
										c.setGeoId(worldKey);
										c.setTerritory(worldKey);
										c.setTerritoryCode(worldKey);
										c.setTerritoryParent("Earth");
										c.setOrderId(OrderIdEnum.EARTH.getOrderId());
										territoryParentPopulationMap.put(dateRepKey, c);
									} catch (CloneNotSupportedException e) {
										log.error("Cannot clone: {}", m);
									}
								} else {
									c.setCases(c.getCases() + m.getCases());
									c.setDeaths(c.getDeaths() + m.getDeaths());
									c.setPopulation(c.getPopulation() + m.getPopulation());
								}
								log.debug(c.getTerritoryParent() + ": " + c.toString());
						  })
						  .filter(d -> {
							  if (filterDisabled.get()) {
								  return true; // do not filter
							  }
							  LocalDate latestDate = territoryLatestDateRepMap.get(d.getTerritory());
							  if (latestDate == null) {
								  Optional<LocalDate> date = repository.getMaxDateRepByTerritoryAndTerritoryParent(d.getTerritory(), d.getTerritoryParent());
								  if (date.isPresent()) {
									  latestDate = date.get();
									  territoryLatestDateRepMap.put(d.getTerritory(), latestDate);
								  } else {
									  return true; // do not filter
								  }
							  }
							  return d.getDateRep().isAfter(latestDate);
						  })
						  .map(d -> { return new CoronaDataEntity(d); })
						  ;//.log();
		
		file.subscribe(data -> {
			Optional<CoronaDataEntity> d = repository.findByGeoIdAndDateRep(data.getGeoId(), data.getDateRep());
			if (d.isPresent()) {
				log.info("Overwritting data: " + data);
				data.setId(d.get().getId());
			} else {
				log.info("Saving data: " + data);
			}
			repository.save(data);
		});
		
		// set population of territories
		Map<String,AtomicLong> territoryParentPopulationMap = new HashMap<>();
		territoryParentMap.keySet().forEach(territoryParentKey -> {
			Map<String, CoronaWorldData> parentMap = territoryParentMap.get(territoryParentKey);
			parentMap.values().forEach(p -> {
				AtomicLong territoryParentPopulation = territoryParentPopulationMap.get(territoryParentKey);
				if (territoryParentPopulation == null) {
					territoryParentPopulation = new AtomicLong();
					territoryParentPopulationMap.put(territoryParentKey, territoryParentPopulation);
				}
				if (p.getPopulation() > territoryParentPopulation.get()) {
					territoryParentPopulation.getAndSet(p.getPopulation());
				}
			});
		});
		log.debug("Territory parent population: " + territoryParentPopulationMap.toString());
		
		kummulativeDataMap.clear();
		territoryParentMap.keySet().forEach(territoryParentKey -> {
			Map<String, CoronaWorldData> worldData = territoryParentMap.get(territoryParentKey);
			Flux<CoronaDataEntity> worldFlux = 
				  Flux.fromIterable(worldData.values())
					  .sort((c1, c2) -> c1.getDateRep().compareTo(c2.getDateRep()))
					  .doOnNext(m -> {
							String territoryKey = m.getTerritory();
							CoronaWorldData c = kummulativeDataMap.get(territoryKey);
							AtomicLong p = territoryParentPopulationMap.get(territoryKey);
							m.setPopulation(p.get());
							if (c != null) {
								m.setCasesKum(m.getCases() + (c.getCasesKum() != null ? c.getCasesKum() : 0L));
								m.setDeathsKum(m.getDeaths() + (c.getDeathsKum() != null ? c.getDeathsKum() : 0L));
								if (m.getPopulation() > 0) {
									m.setCasesPer100000Pop((m.getCasesKum() * 100000.0) / m.getPopulation().doubleValue());
									m.setDeathsPer100000Pop((m.getDeathsKum() * 100000.0) / m.getPopulation().doubleValue());
								} else {
									m.setCasesPer100000Pop(0.0);
									m.setDeathsPer100000Pop(0.0);
								}
							}
							kummulativeDataMap.put(territoryKey, m);
					  })
					  .filter(d -> {
						  if (filterDisabled.get()) {
							  return true; // do not filter
						  }
						  LocalDate latestDate = territoryLatestDateRepMap.get(d.getTerritory());
						  if (latestDate == null) {
							  Optional<LocalDate> date = repository.getMaxDateRepByTerritoryAndTerritoryParent(d.getTerritory(), d.getTerritoryParent());
							  if (date.isPresent()) {
								  latestDate = date.get();
								  territoryLatestDateRepMap.put(d.getTerritory(), latestDate);
							  } else {
								  return true; // do not filter
							  }
						  }
						  return d.getDateRep().isAfter(latestDate);
					  })
					  .map(d -> { return new CoronaDataEntity(d); })
					  ;//.log();
			
			worldFlux.subscribe(data -> save(data));
		});
	}
}
