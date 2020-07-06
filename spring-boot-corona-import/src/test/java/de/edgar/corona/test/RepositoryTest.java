package de.edgar.corona.test;

import static org.junit.Assert.assertNotNull;

import java.time.LocalDate;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import de.edgar.corona.jpa.CoronaDataJpaRepository;

@SpringBootTest
class RepositoryTest {
	
	@Autowired
	private CoronaDataJpaRepository repo;

	@Test
	void testRepo() {
		assertNotNull(repo);
		
		String territoryId = "germany";
		String territoryParent = "europeWest";
		Optional<LocalDate> date = repo.getMaxDateRepByTerritoryIdAndTerritoryParent(territoryId, territoryParent);
		assertNotNull(date.get());
		System.out.println(territoryId + ": " + date.get());
	}

}
