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
	private String territoryId;
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
	
	public CoronaDataEntity(String territoryId, String territory, String territoryParent, Long orderId) {
		this.territoryId = territoryId;
		this.territory = territory;
		this.territoryParent = territoryParent;
		this.orderId = orderId;
	}
	
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
		data.setRecovered(getRecovered() != null ? getRecovered() : 0L);
		data.setRecoveredKum(getRecoveredKum() != null ? getRecoveredKum() : 0L);
		data.setRecoveredPer100000Pop(getRecoveredPer100000Pop() != null ? getRecoveredPer100000Pop() : 0.0);
		data.setActive(getActive() != null ? getActive() : 0L);
		data.setActiveKum(getActiveKum() != null ? getActiveKum() : 0L);
		data.setActivePer100000Pop(getActivePer100000Pop() != null ? getActivePer100000Pop() : 0.0);
		data.setGeoId(getGeoId());
		data.setMonth(getMonth());
		data.setPopulation(getPopulation());
		data.setTerritoryId(getTerritoryId());
		data.setTerritory(getTerritory());
		data.setTerritoryCode(getTerritoryCode());
		data.setTerritoryParent(getTerritoryParent());
		data.setYear(getYear());
		data.setOrderId(getOrderId());
		return data;
	}
}
