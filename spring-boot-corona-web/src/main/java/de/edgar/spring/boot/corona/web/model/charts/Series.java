package de.edgar.spring.boot.corona.web.model.charts;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class Series {
	
	public Series() {
		yAxis = 0;
		dashStyle = "Solid";
	}

	private String name;
	private List<Double> data;
	@JsonProperty("yAxis")
	private Integer yAxis;
	private String dashStyle;
	private String color;
	
}
