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
		
		String territory = "Germany";
		String territoryParent = "Europe_West";
		Optional<LocalDate> date = repo.getMaxDateRepByTerritoryAndTerritoryParent(territory, territoryParent);
		assertNotNull(date.get());
		System.out.println(territory + ": " + date.get());
	}

}
