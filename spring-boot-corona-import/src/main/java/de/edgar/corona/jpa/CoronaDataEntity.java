package de.edgar.corona.jpa;

import java.time.LocalDate;
import java.time.LocalDateTime;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import de.edgar.corona.model.CoronaData;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name="corona_data")
public class CoronaDataEntity {
	
	public CoronaDataEntity(CoronaData data) {
		this.setCases(data.getCases());
		this.setCasesKum(data.getCasesKum());
		this.setCasesDaysKum(data.getCasesDaysKum());
		this.setCasesPer100000Pop(data.getCasesPer100000Pop());
		this.setDateRep(data.getDateRep());
		this.setDay(data.getDay());
		this.setDeaths(data.getDeaths());
		this.setDeathsKum(data.getDeathsKum());
		this.setDeathsPer100000Pop(data.getDeathsPer100000Pop());
		this.setRecovered(data.getRecovered());
		this.setRecoveredKum(data.getRecoveredKum());
		this.setRecoveredPer100000Pop(data.getRecoveredPer100000Pop());
		this.setActive(data.getActive());
		this.setActiveKum(data.getActiveKum());
		this.setActivePer100000Pop(data.getActivePer100000Pop());
		this.setGeoId(data.getGeoId());
		this.setMonth(data.getMonth());
		this.setPopulation(data.getPopulation());
		this.setTerritoryId(data.getTerritoryId());
		this.setTerritory(data.getTerritory());
		this.setTerritoryCode(data.getTerritoryCode());
		this.setTerritoryParent(data.getTerritoryParent());
		this.setYear(data.getYear());
		this.setOrderId(data.getOrderId());
		this.setTimestamp(LocalDateTime.now());
	}

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
	private LocalDateTime timestamp;
	
	public CoronaData toCoronaData() {
		CoronaData c = new CoronaData();
		
		c.setActive(active);
		c.setActiveKum(activeKum);
		c.setActivePer100000Pop(activePer100000Pop);
		c.setCases(cases);
		c.setCasesDaysKum(casesDaysKum);
		c.setCasesKum(casesKum);
		c.setCasesPer100000Pop(casesPer100000Pop);
		c.setDateRep(dateRep);
		c.setDay(day);
		c.setDeaths(deaths);
		c.setDeathsKum(deathsKum);
		c.setDeathsPer100000Pop(deathsPer100000Pop);
		c.setGeoId(geoId);
		c.setMonth(month);
		c.setOrderId(orderId);
		c.setPopulation(population);
		c.setRecovered(recovered);
		c.setRecoveredKum(recoveredKum);
		c.setRecoveredPer100000Pop(recoveredPer100000Pop);
		c.setTerritory(territory);
		c.setTerritoryCode(territoryCode);
		c.setTerritoryId(territoryId);
		c.setTerritoryParent(territoryParent);
		c.setYear(year);
		
		return c;
	}
}
