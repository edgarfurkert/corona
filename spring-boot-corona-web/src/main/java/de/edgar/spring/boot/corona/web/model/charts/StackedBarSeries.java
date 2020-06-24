package de.edgar.spring.boot.corona.web.model.charts;

import java.util.List;

import lombok.Data;

@Data
public class StackedBarSeries {

	private String name;
	private List<Double> data;
	private String color;
	
}
