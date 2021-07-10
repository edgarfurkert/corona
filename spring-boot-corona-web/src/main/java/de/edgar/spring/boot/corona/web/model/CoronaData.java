package de.edgar.spring.boot.corona.web.model;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class CoronaData implements Cloneable {

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
	private Long deathsDaysKum;
	private Long recoveredKum;
	private Long recoveredDaysKum;
	private Long activeKum;
	private Long activeDaysKum;
	private Double casesPer100000Pop;
	private Double casesDaysPer100000Pop;
	private Double deathsPer100000Pop;
	private Double deathsDaysPer100000Pop;
	private Double recoveredPer100000Pop;
	private Double recoveredDaysPer100000Pop;
	private Double activePer100000Pop;
	private Double activeDaysPer100000Pop;
	private Long firstVaccinations;
	private Long fullVaccinations;
	private Long totalVaccinations;
	private Long firstVaccinationsKum;
	private Long fullVaccinationsKum;
	private Long totalVaccinationsKum;
	private Double firstVaccinationsPer100000Pop;
	private Double fullVaccinationsPer100000Pop;
	private Double totalVaccinationsPer100000Pop;
	private Long orderId;

	public CoronaData clone() throws CloneNotSupportedException {
		return (CoronaData) super.clone();
	}
	
	public Double getFirstVaccinationsKumPercentage() {
		if (this.firstVaccinationsKum != null) {
			return this.firstVaccinationsKum * 100.0 / this.population;
		}
		return 0.0;
	}
	
	public Double getFirstVaccinationsPercentage() {
		if (this.firstVaccinations != null) {
			return this.firstVaccinations * 100.0 / this.population;
		}
		return 0.0;
	}
	
	public Double getFullVaccinationsKumPercentage() {
		if (this.fullVaccinationsKum != null) {
			return this.fullVaccinationsKum * 100.0 / this.population;
		}
		return 0.0;
	}
	
	public Double getFullVaccinationsPercentage() {
		if (this.fullVaccinations != null) {
			return this.fullVaccinations * 100.0 / this.population;
		}
		return 0.0;
	}
	
	public Double getTotalVaccinationsKumPercentage() {
		if (this.totalVaccinationsKum != null) {
			return this.totalVaccinationsKum * 100.0 / this.population;
		}
		return 0.0;
	}
	
	public Double getTotalVaccinationsPercentage() {
		if (this.totalVaccinations != null) {
			return this.totalVaccinations * 100.0 / this.population;
		}
		return 0.0;
	}
}
