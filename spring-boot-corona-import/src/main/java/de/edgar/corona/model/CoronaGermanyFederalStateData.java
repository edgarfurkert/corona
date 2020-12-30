package de.edgar.corona.model;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import de.edgar.corona.config.FederalStatesProperties;

//@Slf4j
public class CoronaGermanyFederalStateData extends CoronaData {
	
	/**
	 * Beispiel: 218,Germany,LK Alb-Donau-Kreis,Alb-Donau-Kreis,Landkreis,Baden-Württemberg,196047,39,0,1356377226.83691,399950.781208159,2020-03-21,39,0,0.019893188878177172,0.0
	 * 
	 *  0: id
	 *  1: Country/Region
	 *  2: county (LK Alb-Donau-Kreis)
	 *  3: countyname
	 *  4: type
	 *  5: federalstate (Baden-Württemberg)
	 *  6: population
	 *  7: infections
	 *  8: deaths
	 *  9: shapearea
	 * 10: shapelength
	 * 11: date
	 * 12: newinfections
	 * 13: newdeaths
	 * 14: infectionrate
	 * 15: deathrate
	 * 
	 * @param line
	 */
	public CoronaGermanyFederalStateData(String line, FederalStatesProperties props) {
		String[] a = line.split(",(?=([^\\\"]*\\\"[^\\\"]*\\\")*[^\\\"]*$)");
		
		Long p = getLong(a[6]);
		
		setCases(getLong(a[12]));
		setCasesKum(getLong(a[7]));
		setCasesPer100000Pop(p > 0 ? getCasesKum() * 100000.0 / p : 0.0);
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
		LocalDate date = LocalDate.parse((a[11]), formatter);
		setDateRep(date.minusDays(1));
		setDay(getDateRep().getDayOfMonth());
		setDeaths(getLong(a[13]));
		setDeathsKum(getLong(a[8]));
		setDeathsPer100000Pop(p > 0 ? getDeathsKum() * 100000.0 / p : 0.0);
		setGeoId(a[2]);
		setMonth(getDateRep().getMonthValue());
		setPopulation(p);
		setTerritoryId(getKey(a[2]));
		setTerritory(a[2]);
		setTerritoryCode(getKey(a[2]));
		setTerritoryParent(getKey(a[5]));
		setYear(getDateRep().getYear());
		setOrderId(OrderIdEnum.COUNTY.getOrderId());
	}
	
}
