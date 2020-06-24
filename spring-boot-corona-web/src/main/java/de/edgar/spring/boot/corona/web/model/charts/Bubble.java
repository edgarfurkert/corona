package de.edgar.spring.boot.corona.web.model.charts;

import lombok.Data;

@Data
public class Bubble {

	private final Integer x;
	private final Double y;
	private final Double z;
	private final String territory;
	private final String date;
	
}
