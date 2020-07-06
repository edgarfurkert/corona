package de.edgar.spring.boot.corona.web;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import de.edgar.spring.boot.corona.web.jpa.CoronaDataJpaRepository;

@SpringBootTest
class SpringBootCoronaWebApplicationTests {
	
	@Autowired
	private CoronaDataJpaRepository repo;

	@Test
	void testRepo() {
		assertNotNull(repo);
		List<String> list = repo.findDistinctTerritoryParent();
		assertNotNull(list);
		assertFalse(list.isEmpty());
		// [Africa, America, Asia, Baden-Württemberg, Bayern, Berlin, Brandenburg, Bremen, Europe, Germany, Hamburg, Hessen, Mecklenburg-Vorpommern, Niedersachsen, Nordrhein-Westfalen, Oceania, Other, Rheinland-Pfalz, Saarland, Sachsen, Sachsen-Anhalt, Schleswig-Holstein, Thüringen]
		System.out.println(list);
		
		List<String> parents = new ArrayList<>();
		parents.add("Europe");
		parents.add("Baden-Württemberg");
		list = repo.findDistinctTerritoryIdByTerritoryParent(parents);
		assertNotNull(list);
		assertFalse(list.isEmpty());
		// [Albania, Andorra, Armenia, Austria, Azerbaijan, Belarus, Belgium, Bosnia_and_Herzegovina, Bulgaria, Croatia, Cyprus, Czechia, Denmark, Estonia, Faroe_Islands, Finland, France, Georgia, Germany, Gibraltar, Greece, Guernsey, Holy_See, Hungary, Iceland, Ireland, Isle_of_Man, Italy, Jersey, Kosovo, Latvia, Liechtenstein, Lithuania, LK Alb-Donau-Kreis, LK Biberach, LK Böblingen, LK Bodenseekreis, LK Breisgau-Hochschwarzwald, LK Calw, LK Emmendingen, LK Enzkreis, LK Esslingen, LK Freudenstadt, LK Göppingen, LK Heidenheim, LK Heilbronn, LK Hohenlohekreis, LK Karlsruhe, LK Konstanz, LK Lörrach, LK Ludwigsburg, LK Main-Tauber-Kreis, LK Neckar-Odenwald-Kreis, LK Ortenaukreis, LK Ostalbkreis, LK Rastatt, LK Ravensburg, LK Rems-Murr-Kreis, LK Reutlingen, LK Rhein-Neckar-Kreis, LK Rottweil, LK Schwäbisch Hall, LK Schwarzwald-Baar-Kreis, LK Sigmaringen, LK Tübingen, LK Tuttlingen, LK Waldshut, LK Zollernalbkreis, Luxembourg, Malta, Moldova, Monaco, Montenegro, Netherlands, North_Macedonia, Norway, Poland, Portugal, Romania, Russia, San_Marino, Serbia, SK Baden-Baden, SK Freiburg i.Breisgau, SK Heidelberg, SK Heilbronn, SK Karlsruhe, SK Mannheim, SK Pforzheim, SK Stuttgart, SK Ulm, Slovakia, Slovenia, Spain, Sweden, Switzerland, Ukraine, United_Kingdom]
		System.out.println(list);
	}

}
