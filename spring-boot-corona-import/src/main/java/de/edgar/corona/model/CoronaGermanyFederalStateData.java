package de.edgar.corona.model;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import de.edgar.corona.config.GermanyFederalStatesProperties;
import lombok.extern.slf4j.Slf4j;

@Slf4j
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
	public CoronaGermanyFederalStateData(String line, GermanyFederalStatesProperties props) {
		String[] a = line.split(",(?=([^\\\"]*\\\"[^\\\"]*\\\")*[^\\\"]*$)");
		
		FederalState fs = props.findByKey(a[5]);
		String tp = a[5];
		if (fs != null) {
			tp = fs.getName();
		} else {
			log.error("CoronaGermanyFederalStateData: federal state {} not found.", tp);
		}
		
		Long p = Long.valueOf(a[6]);
		
		setCases(Long.valueOf(a[12]));
		setCasesKum(Long.valueOf(a[7]));
		setCasesPer100000Pop(p > 0 ? getCasesKum() * 100000.0 / p : 0.0);
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
		LocalDate date = LocalDate.parse((a[11]), formatter);
		setDateRep(date);
		setDay(getDateRep().getDayOfMonth());
		setDeaths(Long.valueOf(a[13]));
		setDeathsKum(Long.valueOf(a[8]));
		setDeathsPer100000Pop(p > 0 ? getDeathsKum() * 100000.0 / p : 0.0);
		setGeoId(a[2]);
		setMonth(getDateRep().getMonthValue());
		setPopulation(p);
		setTerritory(a[2]);
		setTerritoryCode(a[2]);
		setTerritoryParent(tp);
		setYear(getDateRep().getYear());
		setPrecision(1000L);
	}
	
}
