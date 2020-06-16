package de.edgar.corona.model;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import de.edgar.corona.config.GermanyFederalStatesProperties;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class CoronaGermanyData extends CoronaData {
	
	/**
	 *  0: id
	 *  1: Country/Region
	 *  2: federalstate
	 *  3: infections
	 *  4: deaths
	 *  5: date (2020-02-28)
	 *  6: newinfections
	 *  7: newdeaths
	 * 
	 * @param line
	 */
	public CoronaGermanyData(String line, GermanyFederalStatesProperties props) {
		String[] a = line.split(",(?=([^\\\"]*\\\"[^\\\"]*\\\")*[^\\\"]*$)");
		
		FederalState fs = props.findByKey(a[2]);
		Long p = 0L;
		String t = a[2];
		String c = a[2];
		if (fs != null) {
			p = fs.getPopulation();
			t = fs.getName();
			c = fs.getCode();
		} else {
			log.error("CoronaGermanyData: federal state {} not found.", a[2]);
		}
		setCases(Long.valueOf(a[6]));
		setCasesKum(Long.valueOf(a[3]));
		setCasesPer100000Pop(p > 0 ? getCasesKum() * 100000.0 / p : 0.0);
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
		LocalDate date = LocalDate.parse((a[5]), formatter);
		setDateRep(date);
		setDay(getDateRep().getDayOfMonth());
		setDeaths(Long.valueOf(a[7]));
		setDeathsKum(Long.valueOf(a[4]));
		setDeathsPer100000Pop(p > 0 ? getDeathsKum() * 100000.0 / p : 0.0);
		setGeoId(c);
		setMonth(getDateRep().getMonthValue());
		setPopulation(p);
		setTerritory(t);
		setTerritoryCode(c);
		setTerritoryParent(a[1]);
		setYear(getDateRep().getYear());
		setPrecision(100L);
	}
	
}
