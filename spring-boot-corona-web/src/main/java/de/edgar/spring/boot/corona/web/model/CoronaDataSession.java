package de.edgar.spring.boot.corona.web.model;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import org.springframework.format.annotation.DateTimeFormat;

import lombok.Data;

@Data
public class CoronaDataSession {
	
	public CoronaDataSession() {
		territoryParents = new ArrayList<>();
		locale = Locale.GERMAN;
	}

	private List<Territory> territoryParents;
	
	private List<String> selectedTerritoryParents;

	private List<Territory> territories;
	
	private List<String> selectedTerritories;
	
	private List<GraphType> graphTypes;
	
	private String selectedGraphType;
	
	private List<DataType> dataTypes;
	
	private List<DataType> dataCategories;
	
	private String selectedDataType;
	
	private String selectedDataCategory;
	
	private List<AxisType> yAxisTypes;
	
	private String selectedYAxisType;
	
	@DateTimeFormat(iso = DateTimeFormat.ISO.DATE) 
	private LocalDate fromDate;
	
	@DateTimeFormat(iso = DateTimeFormat.ISO.DATE) 
	private LocalDate toDate;
	
	private Locale locale;
	
}
