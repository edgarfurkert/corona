package de.edgar.corona.reactive;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicBoolean;

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
public class CoronaGermanyFederalStatesDataCsvImport extends CoronaDataImport {

	@Autowired
	private GermanyFederalStatesProperties props;
	
	public CoronaGermanyFederalStatesDataCsvImport(CoronaDataJpaRepository repository) {
		this.repository = repository;
	}

	public void importData(String fileName) {
		log.info("Importing file " + fileName);
		
		Map<String, LocalDate> territoryLatestDateRepMap = Collections.synchronizedMap(new HashMap<>());
		Map<String, Long> territoryDateRepDaysMap = Collections.synchronizedMap(new HashMap<>());

		Path path = Paths.get(fileName);
		
		// check update file
		fileName = path.getFileName().toString();
		AtomicBoolean filterDisabled = new AtomicBoolean(
				updateCheckService.checkUpdateFile(path.getParent().toString(), fileName, true));
		LocalDate now = LocalDate.now();

		Flux<CoronaDataEntity> coronaData = 
				FluxFileReader.fromPath(path)
						  .skip(1)
						  .map(l -> { return new CoronaGermanyFederalStateData(l, props); })
						  .filter(d -> { return d.getDateRep().isBefore(now); })
						  .sort((c1, c2) -> c1.getDateRep().compareTo(c2.getDateRep()))
						  .doOnNext(d -> {
							  LocalDate date = d.getDateRep();
							  Long daysSum;
							  String key;
							  for (int i = 0; i < (daysToSum == null ? 0 : daysToSum); i++) {
								  key = d.getTerritoryId() + date;
								  daysSum = territoryDateRepDaysMap.get(key);
								  territoryDateRepDaysMap.put(key, (daysSum == null ? d.getCases() : daysSum + d.getCases()));
								  date = date.plusDays(1);
							  }
						  })
						  .filter(d -> {
							  if (filterDisabled.get()) {
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
			data.setCasesDaysKum(territoryDateRepDaysMap.get(data.getTerritoryId() + data.getDateRep()));
			save(data);
		});
		
	}

}
