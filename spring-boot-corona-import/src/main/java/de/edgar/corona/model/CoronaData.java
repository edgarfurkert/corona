package de.edgar.corona.model;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
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
	private String territory;
	private String territoryCode;
	private String geoId;
	private Long population;
	private String territoryParent;
	private Long casesKum;
	private Long casesDaysKum;
	private Long deathsKum;
	private Double casesPer100000Pop;
	private Double deathsPer100000Pop;
	private Long orderId;
	
	protected Long getLong(String v) {
		if (v == null) {
			return 0L;
		}
		Long l = 0L;
		try {
			v = v.trim();
			l = Long.parseLong(v.length() > 0 ? v : "0");
		} catch (NumberFormatException e) {
			log.warn("Value '{}' is not a Long.", v);
		}
		return l;
	}
	
	protected Integer getInteger(String v) {
		if (v == null) {
			return 0;
		}
		Integer i = 0;
		try {
			v = v.trim();
			i = Integer.parseInt(v.length() > 0 ? v : "0");
		} catch (NumberFormatException e) {
			log.warn("Value '{}' is not a Integer.", v);
		}
		return i;
	}
}
