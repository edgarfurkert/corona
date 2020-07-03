package de.edgar.corona.model;

import java.time.LocalDate;

public class CoronaWorldData extends CoronaData {

	public CoronaWorldData() {
	}
	
	public CoronaWorldData(String line) {
		String[] a = line.split(",(?=([^\\\"]*\\\"[^\\\"]*\\\")*[^\\\"]*$)");
		setDay(getInteger(a[1]));
		setMonth(getInteger(a[2]));
		setYear(getInteger(a[3]));
		setDateRep(LocalDate.of(getYear(), getMonth(), getDay()));
		setCases(getLong(a[4]));
		setDeaths(getLong(a[5]));
		setTerritory(a[6].replaceAll("\"", ""));
		setTerritoryId(getTerritoryId(getTerritory()));
		setGeoId(a[7]);
		setTerritoryCode(a[8].length() > 0 ? a[8] : a[7]);
		setPopulation(getLong(a[9]));
		setTerritoryParent(a[10]);
		setOrderId(OrderIdEnum.TERRITORY.getOrderId());
	}

	@Override
	public CoronaWorldData clone() throws CloneNotSupportedException {
		return (CoronaWorldData)super.clone();
	}
}
