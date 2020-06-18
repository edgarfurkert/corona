package de.edgar.spring.boot.corona.web.model.charts;

import java.util.List;

import lombok.Data;

@Data
public class BarSeries {

	private String title;
	private List<List<Object>> data;
	private List<String> colors;
	
}
