package de.edgar.corona.reactive;

import java.time.LocalDateTime;
import java.util.Optional;

import org.apache.commons.lang3.StringUtils;
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
			if (isNull(entity.getActive())) {
				entity.setActive(d.get().getActive());
			}
			if (isNull(entity.getActiveKum())) {
				entity.setActiveKum(d.get().getActiveKum());
			}
			if (isNull(entity.getActivePer100000Pop())) {
				entity.setActivePer100000Pop(d.get().getActivePer100000Pop());
			}			
			if (isNull(entity.getPopulation())) {
				entity.setPopulation(d.get().getPopulation());
			}			
			if (isNull(entity.getCases())) {
				entity.setCases(d.get().getCases());
			}			
			if (isNull(entity.getCasesDaysKum())) {
				entity.setCasesDaysKum(d.get().getCasesDaysKum());
			}			
			if (isNull(entity.getCasesPer100000Pop())) {
				entity.setCasesPer100000Pop(d.get().getCasesPer100000Pop());
			}			
			if (isNull(entity.getCasesPer100000Pop())) {
				entity.setCasesPer100000Pop(d.get().getCasesPer100000Pop());
			}			
			if (isNull(entity.getDeaths())) {
				entity.setDeaths(d.get().getDeaths());
			}			
			if (isNull(entity.getDeathsKum())) {
				entity.setDeathsKum(d.get().getDeathsKum());
			}			
			if (isNull(entity.getDeathsPer100000Pop())) {
				entity.setDeathsPer100000Pop(d.get().getDeathsPer100000Pop());
			}			
			if (isNull(entity.getRecovered())) {
				entity.setRecovered(d.get().getRecovered());
			}			
			if (isNull(entity.getRecoveredKum())) {
				entity.setRecoveredKum(d.get().getRecoveredKum());
			}			
			if (isNull(entity.getRecoveredPer100000Pop())) {
				entity.setRecoveredPer100000Pop(d.get().getRecoveredPer100000Pop());
			}			
			if (isNull(entity.getFirstVaccinations())) {
				entity.setFirstVaccinations(d.get().getFirstVaccinations());
			}			
			if (isNull(entity.getFirstVaccinationsKum())) {
				entity.setFirstVaccinationsKum(d.get().getFirstVaccinationsKum());
			}			
			if (isNull(entity.getFirstVaccinationsPer100000Pop())) {
				entity.setFirstVaccinationsPer100000Pop(d.get().getFirstVaccinationsPer100000Pop());
			}			
			if (isNull(entity.getFullVaccinations())) {
				entity.setFullVaccinations(d.get().getFullVaccinations());
			}			
			if (isNull(entity.getFullVaccinationsKum())) {
				entity.setFullVaccinationsKum(d.get().getFullVaccinationsKum());
			}			
			if (isNull(entity.getFullVaccinationsPer100000Pop())) {
				entity.setFullVaccinationsPer100000Pop(d.get().getFullVaccinationsPer100000Pop());
			}			
			if (isNull(entity.getTotalVaccinations())) {
				entity.setTotalVaccinations(d.get().getTotalVaccinations());
			}			
			if (isNull(entity.getTotalVaccinationsKum())) {
				entity.setTotalVaccinationsKum(d.get().getTotalVaccinationsKum());
			}			
			if (isNull(entity.getTotalVaccinationsPer100000Pop())) {
				entity.setTotalVaccinationsPer100000Pop(d.get().getTotalVaccinationsPer100000Pop());
			}			
			if (StringUtils.isEmpty(entity.getGeoId())) {
				entity.setGeoId(d.get().getGeoId());
			}			
			if (StringUtils.isEmpty(entity.getTerritoryCode())) {
				entity.setTerritoryCode(d.get().getTerritoryCode());
			}			
		} else {
			log.info("Saving data: " + entity);
		}
		repository.save(entity);
	}
	
	private boolean isNull(Long l) {
		return l == null || l < 1L;
	}
	
	private boolean isNull(Double d) {
		return d == null || d < 1.0;
	}
	
	
	/**
	 * Overwrite defined data (cases, cumulated cases,...) 
	 * 
	 * @param entity
	 * @param columns
	 */
	protected void save(CoronaDataEntity entity, String[] columns) {
		save(entity, columns, false);
	}
	
	/**
	 * Overwrite defined data (cases, cumulated cases,...) 
	 * 
	 * @param entity
	 * @param columns
	 * @param onlyOverwrite
	 */
	protected void save(CoronaDataEntity entity, String[] columns, boolean onlyOverwrite) {
		log.debug("{}", entity);
		Optional<CoronaDataEntity> d = repository.findByTerritoryIdAndDateRep(entity.getTerritoryId(), entity.getDateRep());
		if (d.isPresent()) {
			log.info("Overwriting data: {}", d.get());
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
					case "firstVaccinations": e.setFirstVaccinations(entity.getFirstVaccinations()); break;
					case "firstVaccinationsKum": e.setFirstVaccinationsKum(entity.getFirstVaccinationsKum()); break;
					case "firstVaccinationsPer100000Pop": e.setFirstVaccinationsPer100000Pop(entity.getFirstVaccinationsPer100000Pop()); break;
					case "fullVaccinations": e.setFullVaccinations(entity.getFullVaccinations()); break;
					case "fullVaccinationsKum": e.setFullVaccinationsKum(entity.getFullVaccinationsKum()); break;
					case "fullVaccinationsPer100000Pop": e.setFullVaccinationsPer100000Pop(entity.getFullVaccinationsPer100000Pop()); break;
					case "totalVaccinations": e.setTotalVaccinations(entity.getTotalVaccinations()); break;
					case "totalVaccinationsKum": e.setTotalVaccinationsKum(entity.getTotalVaccinationsKum()); break;
					case "totalVaccinationsPer100000Pop": e.setTotalVaccinationsPer100000Pop(entity.getTotalVaccinationsPer100000Pop()); break;
					default: log.error("save: Cannot handle column '{}'", column); break;
				}
			}
			entity = e;
		} else {
			if (onlyOverwrite) {
				return;
			}
			log.info("Saving data: " + entity);
		}
		repository.save(entity);
	}
}
