package de.edgar.corona.model;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import de.edgar.corona.config.FederalStatesProperties;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class CoronaSwitzerlandDeathsData extends CoronaData {
	
	private static final String[] cantons = {"AG","AI","AR","BE","BL","BS","FR","GE","GL","GR","JU","LU","NE","NW","OW","SG","SH","SO","SZ","TG","TI","UR","VD","VS","ZG","ZH"};
	
	@Getter
	public List<CoronaSwitzerlandCantonData> cantonData = new ArrayList<>();
	
	/**
	 *   0: Date
	 *   1: AG
	 *   2: AI
	 *   3: AR
	 *   4: BE
	 *   5: BL
	 *   6: BS
	 *   7: FR
	 *   8: GE
	 *   9: GL
	 *  10: GR
	 *  11: JU
	 *  12: LU
	 *  13: NE
	 *  14: NW
	 *  15: OW
	 *  16: SG
	 *  17: SH
	 *  18: SO
	 *  19: SZ
	 *  20: TG
	 *  21: TI
	 *  22: UR
	 *  23: VD
	 *  24: VS
	 *  25: ZG
	 *  26: ZH
	 *  27: CH
	 * 
	 * @param line
	 * @param props
	 */
	public CoronaSwitzerlandDeathsData(String line, FederalStatesProperties props) {
		String[] a = line.split(",(?=([^\\\"]*\\\"[^\\\"]*\\\")*[^\\\"]*$)");
		
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
		LocalDate date = LocalDate.parse((a[0]), formatter);
		
		CoronaSwitzerlandCantonData cd;
		FederalState fs;
		for (int i = 1; i < 27; i++) {
			fs = props.findByCode(cantons[i-1]);
			if (fs == null) {
				log.error("No federal state property found for canton '{}'!", cantons[i]);
				continue;
			}
			cd = new CoronaSwitzerlandCantonData();
			cd.setDateRep(date);
			cd.setDay(cd.getDateRep().getDayOfMonth());
			cd.setMonth(cd.getDateRep().getMonthValue());
			cd.setYear(cd.getDateRep().getYear());
			cd.setGeoId(cantons[i-1]);
			cd.setTerritoryCode(cantons[i-1]);
			cd.setDeathsKum(getLong(a[i]));
			cd.setTerritory(fs.getName());
			cd.setTerritoryId(fs.getKey());
			cd.setTerritoryParent(fs.getParent());
			cd.setPopulation(fs.getPopulation());
			cd.setDeathsPer100000Pop(cd.getPopulation() > 0 ? cd.getDeathsKum() * 100000.0 / cd.getPopulation() : 0.0);
			cantonData.add(cd);
		}
		
		setDateRep(date);
		setDay(getDateRep().getDayOfMonth());
		setMonth(getDateRep().getMonthValue());
		setYear(getDateRep().getYear());
		setGeoId("CH");
		setTerritoryCode("CHE");
		setTerritory("Switzerland");
		setDeathsKum(getLong(a[27]));
		setOrderId(OrderIdEnum.COUNTRY.getOrderId());
	}
	
}
