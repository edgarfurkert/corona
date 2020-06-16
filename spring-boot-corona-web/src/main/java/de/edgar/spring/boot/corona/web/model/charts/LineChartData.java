package de.edgar.spring.boot.corona.web.model.charts;

import java.util.List;

import lombok.Data;

@Data
public class LineChartData {

	private String title;
	private String subTitle;
	private XAxis xAxis;
	private YAxis yAxis;
	private List<Series> series;
	
}
