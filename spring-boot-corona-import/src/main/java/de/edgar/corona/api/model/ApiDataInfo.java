package de.edgar.corona.api.model;

import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApiDataInfo {

	private Long numberOfRecords = 0L;
	private Long numberOfTerritories = 0L;
	private List<ApiTerritoryInfo> territories = new ArrayList<>();
	
}
