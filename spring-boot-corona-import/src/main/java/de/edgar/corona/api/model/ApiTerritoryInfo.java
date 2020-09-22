package de.edgar.corona.api.model;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApiTerritoryInfo {
	
	private String territoryId;
	private String territoryName;
	private String parentId;
	private Long orderId;
	private LocalDate minDate;
	private LocalDate maxDate;

}
