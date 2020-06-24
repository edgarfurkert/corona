package de.edgar.spring.boot.corona.web.model.charts;

import java.util.List;

import lombok.Data;

@Data
public class BubbleSeries {
	
	private String name;
	private List<Bubble> data;
	private String color;
	
}
