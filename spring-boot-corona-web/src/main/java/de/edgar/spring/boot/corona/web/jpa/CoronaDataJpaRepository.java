package de.edgar.spring.boot.corona.web.jpa;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

public interface CoronaDataJpaRepository extends CrudRepository<CoronaDataEntity, Long> {

	@Query("SELECT DISTINCT c.territoryParent FROM CoronaDataEntity c ORDER BY c.territoryParent")
	public List<String> findDistinctTerritoryParent();
	
	@Query("SELECT DISTINCT c.territory FROM CoronaDataEntity c WHERE c.territoryParent in ?1 ORDER BY c.territory")
	public List<String> findDistinctTerritoryByTerritoryParent(List<String> parents);
	
	public List<CoronaDataEntity> findByTerritoryInAndDateRepBetween(List<String> territories, LocalDate from, LocalDate to);
	
	public Optional<CoronaDataEntity> findFirstByTerritoryParent(String parent);
	
	public Optional<CoronaDataEntity> findFirstByTerritory(String territory);
	
	public Optional<CoronaDataEntity> findTopByCasesGreaterThanOrderByDateRep(Long isGreater);
}
