package de.edgar.corona.reactive;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import de.edgar.corona.config.FederalStatesProperties;
import de.edgar.corona.jpa.CoronaDataEntity;
import de.edgar.corona.jpa.CoronaDataJpaRepository;
import de.edgar.corona.model.CoronaGermanyVaccinationData;
import de.edgar.corona.model.FederalState;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Flux;

/**
 * Import corona vaccation data of the federal states in germany.
 * 
 * @author efurkert
 *
 */
@Slf4j
@Component
public class CoronaGermanyVaccinationDataCsvImport extends CoronaDataImport {

	@Autowired
	private FederalStatesProperties props;
	
	public CoronaGermanyVaccinationDataCsvImport(CoronaDataJpaRepository repository) {
		this.repository = repository;
	}

	public void importData(String fileName) {
		log.info("Importing file " + fileName);
		
		Map<String, LocalDate> territoryLatestDateRepMap = Collections.synchronizedMap(new HashMap<>());
		
		Path path = Paths.get(fileName);
		
		// check update file
		fileName = path.getFileName().toString();
		boolean filterDisabled = updateCheckService.checkUpdateFile(path.getParent().toString(), fileName, true);
		LocalDate now = LocalDate.now();
		
		Optional<CoronaDataEntity> germanyEntity = this.repository.findTopByTerritoryIdAndPopulationGreaterThan("germany", 0L);
		if (germanyEntity.isPresent()) {
			FederalState germany = new FederalState();
			germany.setCode(germanyEntity.get().getTerritoryCode());
			germany.setKey(germanyEntity.get().getTerritoryId());
			germany.setName(germanyEntity.get().getTerritory());
			germany.setOrgName(germanyEntity.get().getTerritory());
			germany.setParent(germanyEntity.get().getTerritoryParent());
			germany.setPopulation(germanyEntity.get().getPopulation());
			props.addFederalState(germany);
		}

		Flux<CoronaDataEntity> coronaData = 
				FluxFileReader.fromPath(path)
						  .skip(1)
						  .map(l -> { return new CoronaGermanyVaccinationData(l, props); })
						  .filter(d -> { return d.getDateRep().isBefore(now); })
						  .sort((c1, c2) -> c1.getDateRep().compareTo(c2.getDateRep()))
						  .filter(d -> {
							  if (filterDisabled) {
								  return true; // do not filter
							  }
							  LocalDate latestDate = territoryLatestDateRepMap.get(d.getTerritoryId());
							  if (latestDate == null) {
								  Optional<LocalDate> date = repository.getMaxDateRepByTerritoryIdAndTerritoryParent(d.getTerritoryId(), d.getTerritoryParent());
								  if (date.isPresent()) {
									  latestDate = date.get();
									  territoryLatestDateRepMap.put(d.getTerritoryId(), latestDate);
								  } else {
									  return true; // do not filter
								  }
							  }
							  return d.getDateRep().isAfter(latestDate);
						  })
						  .map(d -> { return new CoronaDataEntity(d); })
						  ;//.log();

		coronaData.subscribe(data -> {
			String[] columns = {
				"firstVaccinations",
				"firstVaccinationsKum",
				"firstVaccinationsPer100000Pop",
				"fullVaccinations",
				"fullVaccinationsKum",
				"fullVaccinationsPer100000Pop",
				"totalVaccinations",
				"totalVaccinationsKum",
				"totalVaccinationsPer100000Pop"
			};
			save(data, columns, true);
		});
		
	}

}
