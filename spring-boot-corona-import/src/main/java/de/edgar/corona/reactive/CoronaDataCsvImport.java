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
public class CoronaDataCsvImport {
	
	@Value( "${corona.data.csv.import.daysToSum}" )
	protected Integer daysToSum;

	@Autowired
	protected UpdateCheckService updateCheckService;

	protected CoronaDataJpaRepository repository;
	
	protected void save(CoronaDataEntity data) {
		Optional<CoronaDataEntity> d = repository.findByGeoIdAndDateRep(data.getGeoId(), data.getDateRep());
		if (d.isPresent()) {
			log.info("Overwritting data: " + data);
			data.setId(d.get().getId());
			data.setTimestamp(LocalDateTime.now());
		} else {
			log.info("Saving data: " + data);
		}
		repository.save(data);
	}
}
