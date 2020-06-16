package de.edgar.spring.boot.corona.web.model.charts;

import lombok.Data;

@Data
public class BarChartData {

	private String title;
	private String subTitle;
	private XAxis xAxis;
	private YAxis yAxis;
	private BarSeries series;
	
}
