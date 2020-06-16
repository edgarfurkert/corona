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

import de.edgar.corona.config.GermanyFederalStatesProperties;
import de.edgar.corona.jpa.CoronaDataEntity;
import de.edgar.corona.jpa.CoronaDataJpaRepository;
import de.edgar.corona.model.CoronaGermanyFederalStateData;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Flux;

@Slf4j
@Component
public class CoronaGermanyFederalStatesDataCsvImport {

	@Autowired
	private GermanyFederalStatesProperties props;
	
	private CoronaDataJpaRepository repository;
	
	public CoronaGermanyFederalStatesDataCsvImport(CoronaDataJpaRepository repository) {
		this.repository = repository;
	}

	public void importData(String fileName) {
		log.info("Importing file " + fileName);
		
		Map<String, LocalDate> territoryLatestDateRepMap = Collections.synchronizedMap(new HashMap<>());

		Path path = Paths.get(fileName);
		Flux<CoronaDataEntity> coronaData = 
				FluxFileReader.fromPath(path)
						  .skip(1)
						  .map(l -> { return new CoronaGermanyFederalStateData(l, props); })
						  .filter(d -> {
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
						  .sort((c1, c2) -> c1.getDateRep().compareTo(c2.getDateRep()))
						  .map(d -> { return new CoronaDataEntity(d); })
						  ;//.log();

		coronaData.subscribe(data -> {
			Optional<CoronaDataEntity> d = repository.findByGeoIdAndDateRep(data.getGeoId(), data.getDateRep());
			if (d.isPresent()) {
				log.info("Overwritting data: " + data);
				data.setId(d.get().getId());
			} else {
				log.info("Saving data: " + data);
			}
			repository.save(data);
		});
		
	}

}
