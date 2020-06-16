package de.edgar.spring.boot.corona.web.model.charts;

import java.util.List;

import lombok.Data;

@Data
public class XAxis {

	private String title;
	private List<String> dates;
	
}
