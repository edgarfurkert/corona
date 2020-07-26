package de.edgar.corona.reactive;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import de.edgar.corona.jpa.CoronaDataEntity;
import de.edgar.corona.jpa.CoronaDataJpaRepository;
import de.edgar.corona.service.UpdateCheckService;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class CoronaDataImport {
	
	@Value( "${corona.data.import.daysToSum}" )
	protected Integer daysToSum;

	@Autowired
	protected UpdateCheckService updateCheckService;

	protected CoronaDataJpaRepository repository;
	
	protected void save(CoronaDataEntity entity) {
		log.debug("{}", entity);
		Optional<CoronaDataEntity> d = repository.findByTerritoryIdAndDateRep(entity.getTerritoryId(), entity.getDateRep());
		if (d.isPresent()) {
			log.info("Overwritting data: " + entity);
			entity.setId(d.get().getId());
			entity.setTimestamp(LocalDateTime.now());
		} else {
			log.info("Saving data: " + entity);
		}
		repository.save(entity);
	}
	
	protected void save(CoronaDataEntity entity, String[] columns) {
		log.debug("{}", entity);
		Optional<CoronaDataEntity> d = repository.findByTerritoryIdAndDateRep(entity.getTerritoryId(), entity.getDateRep());
		if (d.isPresent()) {
			log.info("Overwritting data columns: " + entity);
			CoronaDataEntity e = d.get();
			e.setTimestamp(LocalDateTime.now());
			for (String column : columns) {
				switch(column) {
					case "cases": e.setCases(entity.getCases()); break;
					case "casesKum": e.setCasesKum(entity.getCasesKum()); break;
					case "casesPer100000Pop": e.setCasesPer100000Pop(entity.getCasesPer100000Pop()); break;
					case "deaths": e.setDeaths(entity.getDeaths()); break;
					case "deathsKum": e.setDeathsKum(entity.getDeathsKum()); break;
					case "deathsPer100000Pop": e.setDeathsPer100000Pop(entity.getDeathsPer100000Pop()); break;
					default: log.error("save: Cannot handle column '{}'", column); break;
				}
			}
			entity = e;
		} else {
			log.info("Saving data: " + entity);
		}
		repository.save(entity);
	}
}
