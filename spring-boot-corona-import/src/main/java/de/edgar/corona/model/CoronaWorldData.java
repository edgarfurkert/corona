package de.edgar.corona.model;

import java.time.LocalDate;

public class CoronaWorldData extends CoronaData implements Cloneable {

	public CoronaWorldData() {
	}
	
	public CoronaWorldData(String line) {
		String[] a = line.split(",(?=([^\\\"]*\\\"[^\\\"]*\\\")*[^\\\"]*$)");
		setDay(Integer.valueOf(a[1]));
		setMonth(Integer.valueOf(a[2]));
		setYear(Integer.valueOf(a[3]));
		setDateRep(LocalDate.of(getYear(), getMonth(), getDay()));
		setCases(Long.valueOf(a[4]));
		setDeaths(Long.valueOf(a[5]));
		setTerritory(a[6].replaceAll("\"", ""));
		setGeoId(a[7]);
		setTerritoryCode(a[8].length() > 0 ? a[8] : a[7]);
		setPopulation(Long.valueOf(a[9].length() > 0 ? a[9] : "0"));
		setTerritoryParent(a[10]);
		setPrecision(10L);
	}

	@Override
	public CoronaWorldData clone() throws CloneNotSupportedException {
		return (CoronaWorldData)super.clone();
	}
}
