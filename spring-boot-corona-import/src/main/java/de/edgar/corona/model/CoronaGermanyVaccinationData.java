package de.edgar.corona.model;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

import de.edgar.corona.config.FederalStatesProperties;

//@Slf4j
public class CoronaGermanyVaccinationData extends CoronaData {

	private static Map<Integer, String> idBundeslandMap = new HashMap<>();

	private static void setIdBundeslandMap() {
		idBundeslandMap.put(0, "germany");
		idBundeslandMap.put(1, "schleswigHolstein");
		idBundeslandMap.put(2, "hamburg");
		idBundeslandMap.put(3, "lowerSaxony");
		idBundeslandMap.put(4, "bremen");
		idBundeslandMap.put(5, "northRhineWestphalia");
		idBundeslandMap.put(6, "hesse");
		idBundeslandMap.put(7, "rhinelandPalatinate");
		idBundeslandMap.put(8, "badenWu00FCrttemberg");
		idBundeslandMap.put(9, "bavaria");
		idBundeslandMap.put(10, "saarland");
		idBundeslandMap.put(11, "berlin");
		idBundeslandMap.put(12, "brandenburg");
		idBundeslandMap.put(13, "mecklenburgWesternPomerania");
		idBundeslandMap.put(14, "saxony");
		idBundeslandMap.put(15, "saxonyAnhalt");
		idBundeslandMap.put(16, "thuringia");
	}

	/**
	 * Beispiel: 218,Germany,LK
	 * Alb-Donau-Kreis,Alb-Donau-Kreis,Landkreis,Baden-Württemberg,196047,39,0,1356377226.83691,399950.781208159,2020-03-21,39,0,0.019893188878177172,0.0
	 * 
	 *  0: Tag; 
	 *  1: idBundesland; 
	 *  2: gesamt; 
	 *  3: gesamt1; 
	 *  4: gesamt2; 
	 *  5: biontech; 
	 *  6: biontech2; 
	 *  7: moderna; 
	 *  8: moderna2; 
	 *  9: astrazeneca; 
	 * 10: astrazeneca2; 
	 * 11: janssen; 
	 * 12: gesamt_pro1000; 
	 * 13: gesamt_pro1000_2; 
	 * 14: delta_vortag; 
	 * 15: delta_vortag1; 
	 * 16: delta_vortag2; 
	 * 17: a_gesamt1; 
	 * 18: a_gesamt2; 19: a_biontech1; 20: a_biontech2; 21: a_moderna1; 22: a_moderna2; 23:
	 * a_astrazeneca1; 24: a_astrazeneca2; 25: a_janssen; 26: a_deltavortag1; 27:
	 * a_deltavortag2; 28: lebensalter; 29: beruflich; 30: medizinisch; 31: heim;
	 * 32: lebensalter2; 33: beruflich2; 34: medizinisch2; 35: heim2
	 * 
	 * @param line
	 */
	public CoronaGermanyVaccinationData(String line, FederalStatesProperties props) {
		setIdBundeslandMap();
		String[] a = line.split(";(?=([^\\\"]*\\\"[^\\\"]*\\\")*[^\\\"]*$)");

		Integer idBundesland = getInteger(a[1]);
		String key = idBundeslandMap.get(idBundesland);
		String parent = "germany";
		if (idBundesland == 0) {
			parent = "europeWest";
		}
		FederalState fs = props.findByKeyAndParent(key, parent);
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
		LocalDate date = LocalDate.parse((a[0]), formatter);
		this.setDateRep(date);
		this.setFirstVaccinations(getLong(a[15]));
		this.setFirstVaccinationsKum(getLong(a[3]));
		this.setFullVaccinations(getLong(a[16]));
		this.setFullVaccinationsKum(getLong(a[4]));
		this.setTotalVaccinations(getLong(a[14]));
		this.setTotalVaccinationsKum(getLong(a[2]));
		this.setDay(getDateRep().getDayOfMonth());
		this.setMonth(getDateRep().getMonthValue());
		if (fs != null) {
			this.setPopulation(fs.getPopulation());			
			this.setFirstVaccinationsPer100000Pop(this.getFirstVaccinationsKum() * 100000.0 / fs.getPopulation());
			this.setFullVaccinationsPer100000Pop(this.getFullVaccinationsKum() * 100000.0 / fs.getPopulation());
			this.setTotalVaccinationsPer100000Pop(this.getTotalVaccinationsKum() * 100000.0 / fs.getPopulation());
			this.setTerritory(fs.getName());
			this.setTerritoryCode(fs.getCode());
		}
		this.setTerritoryId(key);
		this.setTerritoryParent(parent);
		this.setYear(getDateRep().getYear());
		this.setOrderId((idBundesland == 0 ? OrderIdEnum.COUNTRY : OrderIdEnum.FEDERALSTATE).getOrderId());
	}

}
