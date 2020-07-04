package de.edgar.spring.boot.corona.web.jpa;

import java.time.LocalDate;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import de.edgar.spring.boot.corona.web.model.CoronaData;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name="corona_data")
public class CoronaDataEntity {
	
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Long id;

	private LocalDate dateRep;
	private Integer day;
	private Integer month;
	private Integer year;
	private Long cases;
	private Long deaths;
	private Long recovered;
	private Long active;
	private String territory;
	private String territoryCode;
	private String geoId;
	private Long population;
	private String territoryParent;
	private Long casesKum;
	private Long casesDaysKum;
	private Long deathsKum;
	private Long recoveredKum;
	private Long activeKum;
	private Double casesPer100000Pop;
	private Double deathsPer100000Pop;
	private Double recoveredPer100000Pop;
	private Double activePer100000Pop;
	private Long orderId;
	
	public CoronaData toCoronaData() {
		CoronaData data = new CoronaData();
		data.setCases(getCases() != null ? getCases() : 0L);
		data.setCasesKum(getCasesKum() != null ? getCasesKum() : 0L);
		data.setCasesDaysKum(getCasesDaysKum() != null ? getCasesDaysKum() : 0L);
		data.setCasesPer100000Pop(getCasesPer100000Pop() != null ? getCasesPer100000Pop() : 0.0);
		data.setDateRep(getDateRep());
		data.setDay(getDay());
		data.setDeaths(getDeaths() != null ? getDeaths() : 0L);
		data.setDeathsKum(getDeathsKum() != null ? getDeathsKum() : 0L);
		data.setDeathsPer100000Pop(getDeathsPer100000Pop() != null ? getDeathsPer100000Pop() : 0.0);
		data.setRecovered(getRecovered());
		data.setRecoveredKum(getRecoveredKum());
		data.setRecoveredPer100000Pop(getRecoveredPer100000Pop());
		data.setActive(getActive());
		data.setActiveKum(getActiveKum());
		data.setActivePer100000Pop(getActivePer100000Pop());
		data.setGeoId(getGeoId());
		data.setMonth(getMonth());
		data.setPopulation(getPopulation());
		data.setTerritory(getTerritory());
		data.setTerritoryCode(getTerritoryCode());
		data.setTerritoryParent(getTerritoryParent());
		data.setYear(getYear());
		data.setOrderId(getOrderId());
		return data;
	}
}
