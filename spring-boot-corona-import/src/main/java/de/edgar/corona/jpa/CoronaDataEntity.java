package de.edgar.corona.jpa;

import java.time.LocalDate;

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
		this.setCasesPer100000Pop(data.getCasesPer100000Pop());
		this.setDateRep(data.getDateRep());
		this.setDay(data.getDay());
		this.setDeaths(data.getDeaths());
		this.setDeathsKum(data.getDeathsKum());
		this.setDeathsPer100000Pop(data.getDeathsPer100000Pop());
		this.setGeoId(data.getGeoId());
		this.setMonth(data.getMonth());
		this.setPopulation(data.getPopulation());
		this.setTerritory(data.getTerritory());
		this.setTerritoryCode(data.getTerritoryCode());
		this.setTerritoryParent(data.getTerritoryParent());
		this.setYear(data.getYear());
		this.setPrecision(data.getPrecision());
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
	private String territory;
	private String territoryCode;
	private String geoId;
	private Long population;
	private String territoryParent;
	private Long casesKum;
	private Long deathsKum;
	private Double casesPer100000Pop;
	private Double deathsPer100000Pop;
	private Long precision;
}
