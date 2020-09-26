package de.edgar.corona.jpa;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

public interface CoronaDataJpaRepository extends CrudRepository<CoronaDataEntity, Long> {

	public Optional<CoronaDataEntity> findByGeoIdAndDateRep(String territory, LocalDate dateRep);
	
	@Query("SELECT MAX(c.dateRep) FROM CoronaDataEntity c WHERE c.territoryId = ?1 AND c.territoryParent = ?2")
	public Optional<LocalDate> getMaxDateRepByTerritoryIdAndTerritoryParent(String territoryId, String territoryParent);
	
	@Query("SELECT MAX(c.dateRep) FROM CoronaDataEntity c WHERE c.territoryId = ?1")
	public Optional<LocalDate> getMaxDateRepByTerritoryId(String territoryId);

	@Query("SELECT MIN(c.dateRep) FROM CoronaDataEntity c WHERE c.territoryId = ?1 AND c.territoryParent = ?2")
	public Optional<LocalDate> getMinDateRepByTerritoryIdAndTerritoryParent(String territoryId, String territoryParent);
	
	@Query("SELECT MIN(c.dateRep) FROM CoronaDataEntity c WHERE c.territoryId = ?1")
	public Optional<LocalDate> getMinDateRepByTerritoryId(String territoryId);
	
	public Optional<CoronaDataEntity> findByTerritoryIdAndDateRep(String territoryId, LocalDate dateRep);
	
	// multiple columns not supported! 
	//@Query("SELECT COUNT(DISTINCT c.territory) FROM CoronaDataEntity c")
	//public long countTerritories();
	
	@Query("SELECT DISTINCT new CoronaDataEntity(c.territoryId, c.territory, c.territoryParent, c.orderId) FROM CoronaDataEntity c")
	public List<CoronaDataEntity> getTerritories();
	
	public Optional<CoronaDataEntity> findTopByTerritoryIdAndTerritoryParentOrderByDateRep(String territoryId, String territoryParent);
	public Optional<CoronaDataEntity> findTopByTerritoryIdAndTerritoryParentOrderByDateRepDesc(String territoryId, String territoryParent);
	
}
