package de.edgar.corona.model;

import java.time.LocalDate;

import org.apache.commons.text.StringEscapeUtils;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
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
	private Long recoveredKum;
	private Long activeKum;
	private Double casesPer100000Pop;
	private Double deathsPer100000Pop;
	private Double recoveredPer100000Pop;
	private Double activePer100000Pop;
	private Long orderId;
	
	protected Long getLong(String v) {
		if (v == null) {
			return 0L;
		}
		Long l = 0L;
		try {
			v = v.trim();
			Double d = Double.parseDouble(v.length() > 0 ? v : "0");
			l = d.longValue();
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
			Double d = Double.parseDouble(v.length() > 0 ? v : "0");
			i = d.intValue();
		} catch (NumberFormatException e) {
			log.warn("Value '{}' is not a Integer.", v);
		}
		return i;
	}
	
	public String getKey(String value) {
		if (value == null) {
			return null;
		}
		String[] tArray = value.split(",|\\(|\\)| |_|-|'|\\*");
		
		String code = "";
		boolean escape = true;
		for (int i = 0; i < tArray.length; i++) {
			if (i == 0) {
				code = tArray[i].toLowerCase();
			} else if (tArray[i].length() > 0) {
				code += tArray[i].substring(0, 1).toUpperCase() + (tArray[i].length() > 1 ? tArray[i].substring(1).toLowerCase() : ""); 
			}
		}
		
		return escape ? StringEscapeUtils.escapeJava(code).replace("\\", "") : code;
	}
	
	public String getTerritoryId() {
		if (this.territoryId == null) {
			this.territoryId = getKey(this.territory);
		}
		
		return this.territoryId;
	}

	@Override
	public CoronaData clone() throws CloneNotSupportedException {
		return (CoronaData)super.clone();
	}
}
