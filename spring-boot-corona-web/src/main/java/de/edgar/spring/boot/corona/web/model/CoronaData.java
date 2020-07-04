package de.edgar.spring.boot.corona.web.model;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class CoronaData {
	
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
	private Double casesDaysPer100000Pop;
	private Double deathsPer100000Pop;
	private Double recoveredPer100000Pop;
	private Double activePer100000Pop;
	private Long orderId;
	
}
