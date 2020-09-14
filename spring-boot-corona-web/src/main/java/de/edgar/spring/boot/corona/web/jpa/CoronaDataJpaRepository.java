package de.edgar.spring.boot.corona.web.jpa;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

public interface CoronaDataJpaRepository extends CrudRepository<CoronaDataEntity, Long> {

	@Query("SELECT DISTINCT c.territoryParent FROM CoronaDataEntity c ORDER BY c.territoryParent")
	public List<String> findDistinctTerritoryParent();
	
	@Query("SELECT DISTINCT c.territoryId FROM CoronaDataEntity c WHERE c.territoryParent IN ?1 ORDER BY c.territoryId")
	public List<String> findDistinctTerritoryIdByTerritoryParent(List<String> parents);
	
	@Query("SELECT DISTINCT new CoronaDataEntity(c.territoryId, c.territory, c.territoryParent, c.orderId) FROM CoronaDataEntity c ORDER BY c.territoryParent, c.territoryId")
	public List<CoronaDataEntity> findDistinctTerritories();
	
	public List<CoronaDataEntity> findByTerritoryIdInAndDateRepBetween(List<String> territories, LocalDate from, LocalDate to);
	
	public Optional<CoronaDataEntity> findFirstByTerritoryParent(String parent);
	
	public Optional<CoronaDataEntity> findFirstByTerritoryId(String territoryId);
	
	public Optional<CoronaDataEntity> findTopByCasesGreaterThanOrderByDateRep(Long isGreater);
	
	@Query("SELECT MAX(c.dateRep) FROM CoronaDataEntity c WHERE c.territoryId = ?1")
	public Optional<LocalDate> getMaxDateRepByTerritoryId(String territory);
	
	public Optional<CoronaDataEntity> getFirstByTerritoryIdAndCasesKumGreaterThanOrderByCasesKumAscDateRepAsc(String territoryId, Long isGreater);

	public Optional<CoronaDataEntity> getFirstByTerritoryIdAndDeathsKumGreaterThanOrderByDeathsKumAscDateRepAsc(String territoryId, Long isGreater);

	public Optional<CoronaDataEntity> getFirstByTerritoryIdAndRecoveredKumGreaterThanOrderByRecoveredKumAscDateRepAsc(String territoryId, Long isGreater);

	public Optional<CoronaDataEntity> getFirstByTerritoryIdAndActiveKumGreaterThanOrderByActiveKumAscDateRepAsc(String territoryId, Long isGreater);

}
