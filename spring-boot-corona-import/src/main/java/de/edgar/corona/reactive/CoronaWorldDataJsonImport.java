package de.edgar.corona.reactive;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicBoolean;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import de.edgar.corona.config.FederalStatesProperties;
import de.edgar.corona.config.TerritoryProperties;
import de.edgar.corona.config.WorldApiProperties;
import de.edgar.corona.jpa.CoronaDataEntity;
import de.edgar.corona.jpa.CoronaDataJpaRepository;
import de.edgar.corona.model.CoronaData;
import de.edgar.corona.model.CountryId;
import de.edgar.corona.model.FederalState;
import de.edgar.corona.model.OrderIdEnum;
import de.edgar.corona.model.Territory;
import de.edgar.corona.service.DateService;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class CoronaWorldDataJsonImport extends CoronaDataImport {
	
	@Autowired
	private DateService dateService;
	
	@Autowired
	private WorldApiProperties worldApiProps;
	
	@Autowired
	private TerritoryProperties territoryProps;
	
	@Autowired
	private FederalStatesProperties federalStatesProps;
	
	public CoronaWorldDataJsonImport(CoronaDataJpaRepository repository) {
		this.repository = repository;
	}

	public void importData(String fileName) {
		log.info("Importing file " + fileName);
		
		Path path = Paths.get(fileName);
		
		// check update file
		fileName = path.getFileName().toString();
		AtomicBoolean filterDisabled = new AtomicBoolean(updateCheckService.checkUpdateFile(path.getParent().toString(), fileName, true));
		log.debug("filterDisabled: {}", filterDisabled);
		
		//create ObjectMapper instance
        ObjectMapper objectMapper = new ObjectMapper();

        //read json file and convert to customer object
    	try {
    		Map<String, CoronaData> territoryParentMap = Collections.synchronizedMap(new HashMap<>());
    		
			JsonNode node = objectMapper.readTree(path.toFile());
			//node = node.get("dates");
			node.forEach(n -> {
				Iterator<Entry<String, JsonNode>> itDateFields = n.fields();
				Entry<String, JsonNode> dateEntry;
				LocalDate date, dataDate;
				CoronaData data;
				while (itDateFields.hasNext()) {
					dateEntry = itDateFields.next();
					if (dateService.matches(dateEntry.getKey())) {
						// get date of data
						date = LocalDate.parse(dateEntry.getKey(), dateService.getDateTimeFormatter());
						log.debug("date: {}", date);
						dataDate = date.plusDays(1);
						Iterator<Entry<String, JsonNode>> itCountriesFields = dateEntry.getValue().fields();
						Entry<String, JsonNode> countriesEntry;
						while (itCountriesFields.hasNext()) {
							// get countries
							countriesEntry = itCountriesFields.next();
							if ("countries".equals(countriesEntry.getKey())) {
								Iterator<Entry<String, JsonNode>> itCountryFields = countriesEntry.getValue().fields();
								Entry<String, JsonNode> countryEntry;
								while (itCountryFields.hasNext()) {
									// get country data
									countryEntry = itCountryFields.next();
									log.debug("Saving country...");
									data = nodeToCoronaData(countryEntry.getValue(), OrderIdEnum.TERRITORY, null);
									if (!data.getDateRep().equals(dataDate)) {
										log.warn("DIFFERENT DATE: data {} vs file {}", data.getDateRep(), dataDate);
									}
									CountryId countryId = worldApiProps.findByNameId(data.getTerritoryId());
									if (countryId != null) {
										data.setTerritoryId(countryId.getTerritoryId());
									}
									Territory t = territoryProps.findByTerritoryId(data.getTerritoryId());
									String territoryParent = (t != null ? t.getTerritoryParent() : null);
									if (territoryParent == null) {
										log.error("No parent found: territoryId = {}", data.getTerritoryId());
									}
									data.setTerritoryParent(territoryParent);
									save(data, true);
									
									String countryTerritory = data.getTerritory();
									
									// collect territory parent and world data
									String worldKey = "World";
									String territoryParentKey = data.getTerritoryParent();
									if (territoryParentKey == null) {
										log.error("territoryParent is null: {}", data.getTerritoryId());
									}
									CoronaData c = territoryParentMap.get(territoryParentKey);
									
									if (c == null) {
										try {
											c = data.clone();
											c.setGeoId(data.getTerritoryParent());
											c.setTerritoryId(null);
											c.setTerritory(data.getTerritoryParent());
											c.setTerritoryCode(data.getTerritoryParent());
											c.setOrderId(OrderIdEnum.WORLD.getOrderId());
											c.setTerritoryParent(worldKey);
											territoryParentMap.put(territoryParentKey, c);
										} catch (CloneNotSupportedException e) {
											log.error("Cannot clone: {}", data);
										}
									} else {
										c.setCases(c.getCases() + data.getCases());
										c.setCasesKum(c.getCasesKum() + data.getCasesKum());
										c.setDeaths(c.getDeaths() + data.getDeaths());
										c.setDeathsKum(c.getDeathsKum() + data.getDeathsKum());
										c.setRecovered(c.getRecovered() + data.getRecovered());
										c.setRecoveredKum(c.getRecoveredKum() + data.getRecoveredKum());
										c.setActive(c.getActive() + data.getActive());
										c.setActiveKum(c.getActiveKum() + data.getActiveKum());
									}
									log.debug(c.getTerritoryParent() + ": " + c.toString());

									c = territoryParentMap.get(worldKey);
									
									if (c == null) {
										try {
											c = data.clone();
											c.setGeoId(worldKey);
											c.setTerritoryId(null);
											c.setTerritory(worldKey);
											c.setTerritoryCode(worldKey);
											c.setOrderId(OrderIdEnum.EARTH.getOrderId());
											c.setTerritoryParent("Earth");
											territoryParentMap.put(worldKey, c);
										} catch (CloneNotSupportedException e) {
											log.error("Cannot clone: {}", data);
										}
									} else {
										c.setCases(c.getCases() + data.getCases());
										c.setCasesKum(c.getCasesKum() + data.getCasesKum());
										c.setDeaths(c.getDeaths() + data.getDeaths());
										c.setDeathsKum(c.getDeathsKum() + data.getDeathsKum());
										c.setRecovered(c.getRecovered() + data.getRecovered());
										c.setRecoveredKum(c.getRecoveredKum() + data.getRecoveredKum());
										c.setActive(c.getActive() + data.getActive());
										c.setActiveKum(c.getActiveKum() + data.getActiveKum());
									}
									log.debug(c.getTerritoryParent() + ": " + c.toString());

									// handle regions
									//debugNode(entry.getValue());
									JsonNode regionsNode = countryEntry.getValue().get("regions");
									//debugNode(regionsNode);
									if (regionsNode.size() > 0) {
										Iterator<JsonNode> itRegionsElements = regionsNode.elements();
										
										JsonNode regionNode;
										while (itRegionsElements.hasNext()) {
											regionNode = itRegionsElements.next();
											data = nodeToCoronaData(regionNode, OrderIdEnum.COUNTRY, countryTerritory);
											FederalState fs = federalStatesProps.findByKey(data.getTerritoryId());
											if (fs != null) {
												data.setTerritoryCode(fs.getCode());
												data.setGeoId(fs.getCode());
												data.setPopulation(fs.getPopulation());
											}
											save(data, false);
										}
									}										
								}
							}
						}
					}
				}
			});
			
			territoryParentMap.keySet().forEach(territoryParentKey -> {
				CoronaData data = territoryParentMap.get(territoryParentKey);
				save(data, true);
			});
		} catch (Exception e) {
			log.error("Cannot handle file {}: {}", fileName, e.getMessage(), e);
		}
	}
	
	private void save(CoronaData data, boolean overwrite) {
		log.debug("Saving node data: {} - {}", data.getTerritoryId(), data);
		LocalDate date = data.getDateRep();
		/*
		Optional<LocalDate> oMinDate = repository.getMinDateRepByTerritoryId(territoryId);
		if (oMinDate.isPresent()) {
			LocalDate minDate = oMinDate.get();
			if (date.isBefore(minDate)) {
				log.info("No data available: {}, {}", data.getTerritoryId(), date);
				return null;
			}
		}
		Optional<LocalDate> oMaxDate = repository.getMaxDateRepByTerritoryId(territoryId);
		if (oMaxDate.isPresent()) {
			LocalDate maxDate = oMaxDate.get();
			if (date.isAfter(maxDate)) {
				log.info("No data available: {}, {}", data.getTerritoryId(), date);
				return null;
			}
		}
		*/
		Optional<CoronaDataEntity> e = repository.findByTerritoryIdAndDateRep(data.getTerritoryId(), date);
		CoronaDataEntity entity = null;
		if (e.isPresent()) {
			entity = e.get();
			entity.setRecovered(data.getRecovered());
			entity.setRecoveredKum(data.getRecoveredKum());
			entity.setRecoveredPer100000Pop(entity.getPopulation() != null ? entity.getRecoveredKum() * 100000.0 / entity.getPopulation() : 0L);
			Long active = entity.getCases() - entity.getDeaths() - entity.getRecovered();
			entity.setActive(active);
			Long activeKum = entity.getCasesKum() - entity.getDeathsKum() - entity.getRecoveredKum();
			entity.setActiveKum(activeKum);
			entity.setActivePer100000Pop(entity.getPopulation() != null ? entity.getActiveKum() * 100000.0 / entity.getPopulation() : 0L);
			entity.setTimestamp(LocalDateTime.now());
			log.info("Overwritting data: {} - {}", entity.getTerritoryId(), entity);
			if (log.isDebugEnabled() && activeKum.longValue() != data.getActiveKum().longValue()) {
				log.debug("ACTIVE KUM DIFF: {} - {} vs {}", entity.getTerritoryId(), data.getActiveKum(), activeKum);
			}
			if (log.isDebugEnabled() && data.getCasesKum().longValue() != entity.getCasesKum().longValue()) {
				log.debug("CASES DIFF     : {} - {} vs {}", entity.getTerritoryId(), data.getCasesKum(), entity.getCasesKum());
			}
			if (log.isDebugEnabled() && data.getDeathsKum().longValue() != entity.getDeathsKum().longValue()) {
				log.debug("DEATHS DIFF    : {} - {} vs {}", entity.getTerritoryId(), data.getDeathsKum(), entity.getDeathsKum());
			}
		} else {
			if (overwrite) {
				log.info("No data found to overwrite: {}", data);
				return;
			}
			entity = new CoronaDataEntity(data);
			entity.setCasesPer100000Pop(entity.getPopulation() != null ? entity.getCasesKum() * 100000.0 / entity.getPopulation() : 0L);
			entity.setDeathsPer100000Pop(entity.getPopulation() != null ? entity.getDeathsKum() * 100000.0 / entity.getPopulation() : 0L);
			entity.setRecoveredPer100000Pop(entity.getPopulation() != null ? entity.getRecoveredKum() * 100000.0 / entity.getPopulation() : 0L);
			entity.setActivePer100000Pop(entity.getPopulation() != null ? entity.getActiveKum() * 100000.0 / entity.getPopulation() : 0L);
			log.info("Saving data: {} - {}", entity.getTerritoryId(), entity);
		}
		Long checkActiveKum = entity.getCasesKum() - entity.getDeathsKum() - entity.getRecoveredKum();
		if (log.isDebugEnabled() && checkActiveKum.longValue() != entity.getActiveKum().longValue()) {
			log.debug("ACTIVE KUM MISMATCH: {} - {} vs {}", entity.getTerritoryId(), checkActiveKum, entity.getActiveKum());
		}
		repository.save(entity);
	}
	
	/**
	 * Map the given JsonNode to an CoronaData object.
	 * 						
	 * field: date = STRING
	 * field: id = STRING
	 * field: links = ARRAY
	 * field: name = STRING
	 * field: name_es = STRING
	 * field: name_it = STRING
	 * field: regions = ARRAY
	 * field: source = STRING
	 * field: today_confirmed = NUMBER
	 * field: today_deaths = NUMBER
	 * field: today_new_confirmed = NUMBER
	 * field: today_new_deaths = NUMBER
	 * field: today_new_open_cases = NUMBER
	 * field: today_new_recovered = NUMBER
	 * field: today_open_cases = NUMBER
	 * field: today_recovered = NUMBER
	 * field: today_vs_yesterday_confirmed = NUMBER
	 * field: today_vs_yesterday_deaths = NUMBER
	 * field: today_vs_yesterday_open_cases = NUMBER
	 * field: today_vs_yesterday_recovered = NUMBER
	 * field: yesterday_confirmed = NUMBER
	 * field: yesterday_deaths = NUMBER
	 * field: yesterday_open_cases = NUMBER
	 * field: yesterday_recovered = NUMBER
	 * 
	 * @param node JsonNode
	 * @param orderId
	 * @param territoryParent
	 * @return CoronaData
	 */
	private CoronaData nodeToCoronaData(JsonNode node, OrderIdEnum orderId, String territoryParent) {
		if (node == null) {
			return null;
		}
		CoronaData data = new CoronaData();
		
		data.setActive(node.get("today_new_open_cases") != null ? node.get("today_new_open_cases").asLong() : 0L);
		data.setActiveKum(node.get("today_open_cases") != null ? node.get("today_open_cases").asLong() : 0L);
		data.setCases(node.get("today_open_cases") != null ? node.get("today_new_confirmed").asLong() : 0L);
		data.setCasesKum(node.get("today_confirmed") != null ? node.get("today_confirmed").asLong() : 0L);
		data.setDateRep(node.get("date") != null ? LocalDate.parse(node.get("date").asText(), dateService.getDateTimeFormatter()).plusDays(1) : null);
		data.setDay(data.getDateRep() != null ? data.getDateRep().getDayOfMonth() : null);
		data.setDeaths(node.get("today_new_deaths") != null ? node.get("today_new_deaths").asLong() : 0L);
		data.setDeathsKum(node.get("today_deaths") != null ? node.get("today_deaths").asLong() : 0L);
		data.setGeoId(node.get("id") != null ? node.get("id").asText() : null);
		data.setMonth(data.getDateRep() != null ? data.getDateRep().getMonthValue() : null);
		data.setOrderId(orderId.getOrderId());
		data.setRecovered(node.get("today_new_recovered") != null ? node.get("today_new_recovered").asLong() : 0L);
		data.setRecoveredKum(node.get("today_recovered") != null ? node.get("today_recovered").asLong() : 0L);
		data.setTerritory(node.get("name") != null ? node.get("name").asText() : null);
		data.setTerritoryCode(node.get("id") != null ? node.get("id").asText() : null);
		data.setTerritoryParent(territoryParent);
		data.setYear(data.getDateRep() != null ? data.getDateRep().getYear() : null);
		
		return data;
	}
	
	private void debugNode(JsonNode node) {
		if (node == null) {
			log.debug("node = null");
			return;
		}
		log.debug("asText: {}", node.asText());
		log.debug("size: {}", node.size());
		Iterator<Entry<String, JsonNode>> itFields = node.fields();
		Entry<String, JsonNode> entry;
		while (itFields.hasNext()) {
			entry = itFields.next();
			log.debug("field: {} = {} ({})", entry.getKey(), entry.getValue(), entry.getValue().getNodeType());
		}
		Iterator<String> itFieldNames = node.fieldNames();
		while (itFieldNames.hasNext()) {
			log.debug("fieldNames: {}", itFieldNames.next());
		}
		Iterator<JsonNode> itNode = node.elements();
		while (itNode.hasNext()) {
			log.debug("elements - nodeType: {}", itNode.next().getNodeType().toString());
		}
	}
}
