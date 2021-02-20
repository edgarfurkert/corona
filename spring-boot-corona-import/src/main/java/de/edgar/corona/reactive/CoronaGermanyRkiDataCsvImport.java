package de.edgar.corona.reactive;

import java.io.FileWriter;
import java.io.PrintWriter;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import de.edgar.corona.config.DownloadProperties;
import de.edgar.corona.config.DownloadUrlProperty;
import de.edgar.corona.config.FederalStatesProperties;
import de.edgar.corona.config.GermanyCountyProperties;
import de.edgar.corona.jpa.CoronaDataEntity;
import de.edgar.corona.jpa.CoronaDataJpaRepository;
import de.edgar.corona.model.CoronaData;
import de.edgar.corona.model.CoronaGermanyRkiData;
import de.edgar.corona.model.FederalState;
import de.edgar.corona.model.OrderIdEnum;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Flux;

/**
 * Import corona data of the federal states and counties in germany.
 * 
 * @author efurkert
 *
 */
@Slf4j
@Component
public class CoronaGermanyRkiDataCsvImport extends CoronaDataImport {

	@Autowired
	private FederalStatesProperties props;
	
	@Autowired
	private DownloadProperties downloadProperties;
	
	@Autowired
	private GermanyCountyProperties countyProperties;
	
	@Value( "${corona.data.import.path}" )
	protected String importPath;
	
	public CoronaGermanyRkiDataCsvImport(CoronaDataJpaRepository repository) {
		this.repository = repository;
	}

	public void importData(String fileName) {
		log.info("Importing file " + fileName);
		
		Map<String, CoronaData> rkiCountiesDataMap = Collections.synchronizedMap(new HashMap<>());
		Map<String, CoronaData> rkiFederalStatesDataMap = Collections.synchronizedMap(new HashMap<>());
		Map<String, Long> populationMap = Collections.synchronizedMap(new HashMap<>());
		
		Path path = Paths.get(fileName);
		
		fileName = path.getFileName().toString();
		LocalDate now = LocalDate.now();

		Flux<CoronaGermanyRkiData> coronaData = 
				FluxFileReader.fromPath(path)
						  .skip(1)
						  .map(l -> { return new CoronaGermanyRkiData(l, props); })
						  .filter(d -> { return d.getDateRep().isBefore(now); })
						  .sort((c1, c2) -> c1.getDateRep().compareTo(c2.getDateRep()))
						  .doOnNext(d -> {
							  String key = d.getTerritoryParent() + d.getDateRep();
							  CoronaData fsData = rkiFederalStatesDataMap.get(key);
							  if (fsData == null) {
								  log.info("CoronaGermanyRkiDataCsvImport.importData: {}", d.getTerritoryParent());
								  fsData = new CoronaData();
								  rkiFederalStatesDataMap.put(key, fsData);
								  FederalState fs = props.findByNameAndParent(d.getTerritoryParent(), "germany");
								  if (fs != null) {
									  fsData.setTerritoryId(fs.getKey());
									  fsData.setPopulation(fs.getPopulation());
									  fsData.setTerritoryCode(fs.getCode());
									  fsData.setTerritory(fs.getOrgName());
								  } else {
									  log.warn("CoronaGermanyRkiDataCsvImport.importData: {} - no properties found!", CoronaData.getKey(d.getTerritoryParent()));
									  fsData.setTerritoryId(CoronaData.getKey(d.getTerritoryParent()));
									  fsData.setTerritory(d.getTerritoryParent());
								  }
								  fsData.setCases(d.getCases());
								  fsData.setDeaths(d.getDeaths());
								  fsData.setDateRep(d.getDateRep());
								  fsData.setDay(d.getDay());
								  fsData.setMonth(d.getMonth());
								  fsData.setYear(d.getYear());
								  fsData.setGeoId(d.getGeoId());
								  fsData.setOrderId(OrderIdEnum.FEDERALSTATE.getOrderId());
								  fsData.setTerritoryParent("germany");
							  } else {
								  fsData.setCases(fsData.getCases() + d.getCases());
								  fsData.setDeaths(fsData.getDeaths() + d.getDeaths());
							  }
							  
							  key = d.getTerritoryId() + d.getDateRep();
							  fsData = rkiCountiesDataMap.get(key);
							  if (fsData == null) {
								  log.info("CoronaGermanyRkiDataCsvImport.importData: {}", d.getTerritory());
								  fsData = new CoronaData();
								  rkiCountiesDataMap.put(key, fsData);
								  fsData.setTerritoryId(CoronaData.getKey(d.getTerritory()));
								  fsData.setTerritory(d.getTerritory());
								  fsData.setCases(d.getCases());
								  fsData.setDeaths(d.getDeaths());
								  fsData.setDateRep(d.getDateRep());
								  fsData.setDay(d.getDay());
								  fsData.setMonth(d.getMonth());
								  fsData.setYear(d.getYear());
								  fsData.setGeoId(d.getGeoId());
								  fsData.setOrderId(OrderIdEnum.COUNTY.getOrderId());
								  FederalState fs = props.findByNameAndParent(d.getTerritoryParent(), "germany");
								  if (fs != null) {
									  fsData.setTerritoryParent(fs.getOrgName());
								  } else {
									  log.warn("CoronaGermanyRkiDataCsvImport.importData: {} - no federal state found!", d.getTerritoryParent());
									  fsData.setTerritoryParent(d.getTerritoryParent());
								  }
								  Long population = countyProperties.getPopulationMap().get(fsData.getTerritoryId());
								  if (population == null) {
									  log.warn("CoronaGermanyRkiDataCsvImport.importData: {} - no population found in database!", fsData.getTerritoryId());
								  }
								  fsData.setPopulation(population);
							  } else {
								  fsData.setCases(fsData.getCases() + d.getCases());
								  fsData.setDeaths(fsData.getDeaths() + d.getDeaths());
							  }
							  
						  })
						  ;//.log();

		coronaData.subscribe(data -> {
			//log.info("CoronaGermanyRkiDataCsvImport.importData: subscribe {}", data);
			//data.setCasesDaysKum(territoryDateRepDaysMap.get(data.getTerritoryId() + data.getDateRep()));
			//save(data);
		});
		
		// generate import file: covid19-germany-federalstates-2021-01-09.csv
		List<String> rkiFederalStatesDataMapKeys = new ArrayList<>(rkiFederalStatesDataMap.keySet());
		rkiFederalStatesDataMapKeys.sort(String.CASE_INSENSITIVE_ORDER);
		String territoryId = "";
		Long casesKum = 0L;
		Long deathsKum = 0L;
		int id = 0;
		CoronaData data;
		DownloadUrlProperty downloadUrlProperty = downloadProperties.getUrls()
				                                                    .stream()
				                                                    .filter(urlProperty -> "germanyChannel".equals(urlProperty.getChannel()))
				                                                    .findFirst()
				                                                    .orElseGet(null);
		
		fileName = importPath + "/" + downloadUrlProperty.getFileName() + "-" + LocalDate.now().toString();
		try {
			FileWriter fileWriter = new FileWriter(fileName + ".gen");
			PrintWriter printWriter = new PrintWriter(fileWriter);
			printWriter.println(downloadUrlProperty.getHeader());
			for (String key : rkiFederalStatesDataMapKeys) {
				data = rkiFederalStatesDataMap.get(key);
				if (!data.getTerritoryId().equals(territoryId)) {
					territoryId = data.getTerritoryId();
					casesKum = data.getCases();
					deathsKum = data.getDeaths();
				} else {
					casesKum += data.getCases();
					deathsKum += data.getDeaths();
				}
				data.setCasesKum(casesKum);
				data.setDeathsKum(deathsKum);
				log.info("CoronaGermanyRkiDataCsvImport.importData: {}", data);
				id++;
				// header: id,Country/Region,federalstate,infections,deaths,date,newinfections,newdeaths
			    printWriter.printf("%s,%s,%s,%s,%s,%s,%s,%s", 
			    		           id, 
			    		           data.getTerritoryParent(), 
			    		           data.getTerritory(), 
			    		           data.getCasesKum(),
			    		           data.getDeathsKum(),
			    		           data.getDateRep().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")),
			    		           data.getCases(),
			    		           data.getDeaths())
			               .println();
			};
			printWriter.close();
			
			FileUtils.moveFile(FileUtils.getFile(fileName + ".gen"), FileUtils.getFile(fileName + ".csv"));
		} catch (Exception e) {
			log.error("CoronaGermanyRkiDataCsvImport.importData: Cannot write file {} - {}", fileName, e.getMessage());
		}
		
		// generate import file: covid19-germany-counties-2021-01-09.csv
		List<String> rkiCountiesDataMapKeys = new ArrayList<>(rkiCountiesDataMap.keySet());
		rkiCountiesDataMapKeys.sort(String.CASE_INSENSITIVE_ORDER);
		downloadUrlProperty = downloadProperties.getUrls()
                                                .stream()
                                                .filter(urlProperty -> "germanyFederalStatesChannel".equals(urlProperty.getChannel()))
                                                .findFirst()
                                                .orElseGet(null);
		
		id = 0;
		fileName = importPath + "/" + downloadUrlProperty.getFileName() + "-" + LocalDate.now().toString();
		try {
			FileWriter fileWriter = new FileWriter(fileName + ".gen");
			PrintWriter printWriter = new PrintWriter(fileWriter);
			printWriter.println(downloadUrlProperty.getHeader());
			for (String key : rkiCountiesDataMapKeys) {
				data = rkiCountiesDataMap.get(key);
				if (!data.getTerritoryId().equals(territoryId)) {
					territoryId = data.getTerritoryId();
					casesKum = data.getCases();
					deathsKum = data.getDeaths();
				} else {
					casesKum += data.getCases();
					deathsKum += data.getDeaths();
				}
				data.setCasesKum(casesKum);
				data.setDeathsKum(deathsKum);
				log.info("CoronaGermanyRkiDataCsvImport.importData: {}", data);
				id++;
				// header: id,Country/Region,county,countyname,type,federalstate,population,infections,
				//         deaths,shapearea,shapelength,date,newinfections,newdeaths,infectionrate,deathrate
			    printWriter.printf("%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s", 
			    		           id, 
			    		           "Germany", 
			    		           data.getTerritory(), 
			    		           data.getTerritory(),
			    		           "",
			    		           data.getTerritoryParent(),
			    		           data.getPopulation(),
			    		           data.getCasesKum(),
			    		           data.getDeathsKum(),
			    		           "",
			    		           "",
			    		           data.getDateRep().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")),
			    		           data.getCases(),
			    		           data.getDeaths(),
			    		           "",
			    		           "")
			               .println();
			};
			printWriter.close();
			
			FileUtils.moveFile(FileUtils.getFile(fileName + ".gen"), FileUtils.getFile(fileName + ".csv"));
		} catch (Exception e) {
			log.error("CoronaGermanyRkiDataCsvImport.importData: Cannot write file {} - {}", fileName, e.getMessage());
		}
	}

}
