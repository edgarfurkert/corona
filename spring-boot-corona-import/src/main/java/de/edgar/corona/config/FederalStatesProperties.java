package de.edgar.corona.config;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import de.edgar.corona.model.FederalState;
import lombok.Data;

@Data
public class FederalStatesProperties {

	private List<FederalState> federalStates;
	
	private Map<String, FederalState> federalStateMap;
	
	public FederalState findByKey(String key) {
		if (federalStateMap == null) {
			federalStateMap = new HashMap<>();
			federalStates.forEach(fs -> {
				federalStateMap.put(fs.getKey(), fs);
			});
		}
		
		return federalStateMap.get(key);
	}
}
