package de.edgar.corona.jpa;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

public interface CoronaDataJpaRepository extends CrudRepository<CoronaDataEntity, Long> {

	public Optional<CoronaDataEntity> findByGeoIdAndDateRep(String territory, LocalDate dateRep);
	
	@Query("SELECT MAX(c.dateRep) FROM CoronaDataEntity c WHERE c.territory = ?1 AND c.territoryParent = ?2")
	public Optional<LocalDate> getMaxDateRepByTerritoryAndTerritoryParent(String territory, String territoryParent);
	
	@Query("SELECT MAX(c.dateRep) FROM CoronaDataEntity c WHERE c.territoryId = ?1")
	public Optional<LocalDate> getMaxDateRepByTerritoryId(String territoryId);

	@Query("SELECT MIN(c.dateRep) FROM CoronaDataEntity c WHERE c.territory = ?1 AND c.territoryParent = ?2")
	public Optional<LocalDate> getMinDateRepByTerritoryAndTerritoryParent(String territory, String territoryParent);
	
	@Query("SELECT MIN(c.dateRep) FROM CoronaDataEntity c WHERE c.territoryId = ?1")
	public Optional<LocalDate> getMinDateRepByTerritoryId(String territoryId);
	
	public Optional<CoronaDataEntity> findByTerritoryIdAndDateRep(String territoryId, LocalDate dateRep);
}
