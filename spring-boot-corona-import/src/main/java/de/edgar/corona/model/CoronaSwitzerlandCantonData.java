package de.edgar.corona.model;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class CoronaSwitzerlandCantonData extends CoronaData {
	
	/**
	 *  0: id
	 *  1: Country/Region
	 *  2: federalstate
	 *  3: infections
	 *  4: deaths
	 *  5: date (2020-02-28)
	 *  6: newinfections
	 *  7: newdeaths
	 * 
	 * @param line
	 */
	public CoronaSwitzerlandCantonData() {
		setOrderId(OrderIdEnum.FEDERALSTATE.getOrderId());
	}
	
}
