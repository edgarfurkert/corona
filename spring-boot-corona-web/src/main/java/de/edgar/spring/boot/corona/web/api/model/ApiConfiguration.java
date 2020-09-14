package de.edgar.spring.boot.corona.web.api.model;

import java.time.LocalDate;
import java.util.List;

import de.edgar.spring.boot.corona.web.model.AxisType;
import de.edgar.spring.boot.corona.web.model.DataType;
import de.edgar.spring.boot.corona.web.model.GraphType;
import lombok.Data;

@Data
public class ApiConfiguration {

	LocalDate fromDate;
	LocalDate toDate;
	List<GraphType> graphTypes;
	List<DataType> dataTypes;
	List<DataType> dataCategories;
	List<AxisType> yAxisTypes;
	
}
