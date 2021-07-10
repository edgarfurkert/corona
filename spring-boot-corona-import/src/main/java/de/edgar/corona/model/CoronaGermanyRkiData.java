package de.edgar.corona.model;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import de.edgar.corona.config.FederalStatesProperties;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class CoronaGermanyRkiData extends CoronaData {
	
	/**
	 *  0: FID,
	 *  1: IdBundesland,
	 *  2: Bundesland,
	 *  3: Landkreis,
	 *  4: Altersgruppe,
	 *  5: Geschlecht,
	 *  6: AnzahlFall,
	 *  7: AnzahlTodesfall,
	 *  8: Meldedatum,
	 *  9: IdLandkreis,
	 * 10: Datenstand,
	 * 11: NeuerFall,
	 * 12: NeuerTodesfall,
	 * 13: Refdatum,
	 * 14: NeuGenesen,
	 * 15: AnzahlGenesen,
	 * 16: IstErkrankungsbeginn,
	 * 17: Altersgruppe2
	 * 
	 * @param line
	 */
	public CoronaGermanyRkiData(String line, FederalStatesProperties props) {
		String[] a = line.split(",(?=([^\\\"]*\\\"[^\\\"]*\\\")*[^\\\"]*$)");
		
		String territoryId = getKey(a[3]);
		String parent = getKey(a[2]);
		Long p = 0L;
		String t = a[3];
		String c = a[1];
		/*
		FederalState fs = props.findByKeyAndParent(territoryId, parent);
		if (fs != null) {
			p = fs.getPopulation();
			t = fs.getName();
			c = fs.getCode();
		} else {
			log.error("CoronaGermanyData: federal state {} not found.", a[3]);
		}
		*/
		setCases(getLong(a[6]));
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy/MM/dd hh:mm:ss"); // 2020/02/07 00:00:00
		LocalDate date = LocalDate.parse((a[8]), formatter);
		setDateRep(date);
		setDay(getDateRep().getDayOfMonth());
		setDeaths(getLong(a[7]));
		setGeoId(c);
		setMonth(getDateRep().getMonthValue());
		setPopulation(p);
		setTerritoryId(territoryId);
		setTerritory(t);
		setTerritoryCode(c);
		setTerritoryParent(parent);
		setYear(getDateRep().getYear());
		setOrderId(OrderIdEnum.COUNTY.getOrderId());
	}
	
}
