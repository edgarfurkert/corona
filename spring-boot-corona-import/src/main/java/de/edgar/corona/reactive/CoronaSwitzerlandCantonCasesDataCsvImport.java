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

import de.edgar.corona.config.FederalStatesProperties;
import de.edgar.corona.jpa.CoronaDataEntity;
import de.edgar.corona.jpa.CoronaDataJpaRepository;
import de.edgar.corona.model.CoronaData;
import de.edgar.corona.model.CoronaSwitzerlandCasesData;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Flux;

@Slf4j
@Component
public class CoronaSwitzerlandCantonCasesDataCsvImport extends CoronaDataImport {

	@Autowired
	private FederalStatesProperties props;
	
	public CoronaSwitzerlandCantonCasesDataCsvImport(CoronaDataJpaRepository repository) {
		this.repository = repository;
	}

	public void importData(String fileName) {
		log.info("Importing file " + fileName);
		
		Map<String, LocalDate> territoryLatestDateRepMap = Collections.synchronizedMap(new HashMap<>());
		Map<String, CoronaData> territoryLastCasesRepMap = Collections.synchronizedMap(new HashMap<>());

		Path path = Paths.get(fileName);
		
		// check update file
		fileName = path.getFileName().toString();
		AtomicBoolean filterDisabled = new AtomicBoolean(
				updateCheckService.checkUpdateFile(path.getParent().toString(), fileName, true));
		LocalDate now = LocalDate.now();

		Flux<CoronaDataEntity> coronaData = 
				FluxFileReader.fromPath(path)
						  .skip(1)
						  .map(l -> { return new CoronaSwitzerlandCasesData(l, props); })
						  .filter(d -> { return d.getDateRep().isBefore(now); })
						  .sort((c1, c2) -> c1.getDateRep().compareTo(c2.getDateRep()))
						  .flatMapIterable(s -> s.getCantonData() )
						  .doOnNext(d -> {
							  CoronaData cd = territoryLastCasesRepMap.get(d.getTerritoryId());
							  if (cd != null) {
								  if (d.getCasesKum() > 0L) {
									  d.setCases(d.getCasesKum() - cd.getCasesKum());
								  } else {
									  d.setCases(0L);
									  d.setCasesKum(cd.getCasesKum());
									  d.setCasesPer100000Pop(cd.getCasesPer100000Pop());
								  }
							  }
							  territoryLastCasesRepMap.put(d.getTerritoryId(), d);
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
									  if (latestDate.isAfter(now.minusDays(2))) {
										  latestDate = now.minusDays(2);
									  }
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
			String[] columns = { "cases", "casesKum", "casesPer100000Pop" };
			save(data, columns);
		});
		
	}

}
