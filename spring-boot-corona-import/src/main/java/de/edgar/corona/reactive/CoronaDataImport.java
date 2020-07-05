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
		Optional<CoronaDataEntity> d = repository.findByGeoIdAndDateRep(entity.getGeoId(), entity.getDateRep());
		if (d.isPresent()) {
			log.info("Overwritting data: " + entity);
			entity.setId(d.get().getId());
			entity.setTimestamp(LocalDateTime.now());
		} else {
			log.info("Saving data: " + entity);
		}
		repository.save(entity);
	}
}
