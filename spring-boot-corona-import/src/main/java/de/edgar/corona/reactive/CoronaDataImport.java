package de.edgar.corona.reactive;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import de.edgar.corona.jpa.CoronaDataEntity;
import de.edgar.corona.jpa.CoronaDataJpaRepository;
import de.edgar.corona.service.UpdateCheckService;
import lombok.extern.slf4j.Slf4j;

/**
 * Save/overwrite data in den corona database.
 * 
 * @author efurkert
 *
 */
@Slf4j
public class CoronaDataImport {
	
	@Value( "${corona.data.import.daysToSum}" )
	protected Integer daysToSum;

	@Autowired
	protected UpdateCheckService updateCheckService;

	protected CoronaDataJpaRepository repository;
	
	/**
	 * Save/overwrite data.
	 * 
	 * @param entity
	 */
	protected void save(CoronaDataEntity entity) {
		log.debug("{}", entity);
		Optional<CoronaDataEntity> d = repository.findByTerritoryIdAndDateRep(entity.getTerritoryId(), entity.getDateRep());
		if (d.isPresent()) {
			log.info("Overwritting data: " + entity);
			entity.setId(d.get().getId());
			entity.setTimestamp(LocalDateTime.now());
			if (entity.getActive() == null) {
				entity.setActive(d.get().getActive());
			}
			if (entity.getActiveKum() == null) {
				entity.setActiveKum(d.get().getActiveKum());
			}
			if (entity.getActivePer100000Pop() == null) {
				entity.setActivePer100000Pop(d.get().getActivePer100000Pop());
			}			
			if (entity.getPopulation() == null) {
				entity.setPopulation(d.get().getPopulation());
			}			
			if (entity.getCases() == null) {
				entity.setCases(d.get().getCases());
			}			
			if (entity.getCasesDaysKum() == null) {
				entity.setCasesDaysKum(d.get().getCasesDaysKum());
			}			
			if (entity.getCasesPer100000Pop() == null) {
				entity.setCasesPer100000Pop(d.get().getCasesPer100000Pop());
			}			
			if (entity.getCasesPer100000Pop() == null) {
				entity.setCasesPer100000Pop(d.get().getCasesPer100000Pop());
			}			
			if (entity.getDeaths() == null) {
				entity.setDeaths(d.get().getDeaths());
			}			
			if (entity.getDeathsKum() == null) {
				entity.setDeathsKum(d.get().getDeathsKum());
			}			
			if (entity.getDeathsPer100000Pop() == null) {
				entity.setDeathsPer100000Pop(d.get().getDeathsPer100000Pop());
			}			
			if (entity.getRecovered() == null) {
				entity.setRecovered(d.get().getRecovered());
			}			
			if (entity.getRecoveredKum() == null) {
				entity.setRecoveredKum(d.get().getRecoveredKum());
			}			
			if (entity.getRecoveredPer100000Pop() == null) {
				entity.setRecoveredPer100000Pop(d.get().getRecoveredPer100000Pop());
			}			
			if (entity.getGeoId() == null) {
				entity.setGeoId(d.get().getGeoId());
			}			
			if (entity.getTerritoryCode() == null) {
				entity.setTerritoryCode(d.get().getTerritoryCode());
			}			
		} else {
			log.info("Saving data: " + entity);
		}
		repository.save(entity);
	}
	
	/**
	 * Overwrite defined data (cases, cumulated cases,...) 
	 * 
	 * @param entity
	 * @param columns
	 */
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
