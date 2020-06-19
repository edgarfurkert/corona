package de.edgar.spring.boot.corona.web.model;

import lombok.Getter;

public enum OrderIdEnum {
	EARTH(0L),
	WORLD(1L),
	TERRITORY(10L),
	COUNTRY(100L),
	FEDERALSTATE(1000L),
	UNKNOWN(1000000L);

	@Getter
	private long orderId;
	
	private OrderIdEnum(long l) {
		orderId = l;
	}
}
