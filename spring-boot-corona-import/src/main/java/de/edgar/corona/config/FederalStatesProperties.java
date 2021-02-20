package de.edgar.corona.config;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

import de.edgar.corona.model.CoronaData;
import de.edgar.corona.model.FederalState;
import lombok.Data;

@Configuration
@ConfigurationProperties
@PropertySource(value="classpath:federalStates.yml", encoding="UTF-8", factory=YamlPropertySourceFactory.class)
@Data
public class FederalStatesProperties {

	private List<FederalState> federalStates;
	
	private Map<String, FederalState> federalStateKeyMap;
	private Map<String, FederalState> federalStateNameMap;
	private Map<String, FederalState> federalStateCodeMap;
	
	public FederalState findByKeyAndParent(String key, String parent) {
		if (federalStateKeyMap == null) {
			federalStateKeyMap = new HashMap<>();
			federalStates.forEach(fs -> {
				federalStateKeyMap.put(fs.getKey() + "-" + fs.getParent(), fs);
			});
		}
		
		return federalStateKeyMap.get(key + "-" + parent);
	}
	
	public FederalState findByNameAndParent(String name, String parent) {
		if (federalStateNameMap == null) {
			federalStateNameMap = new HashMap<>();
			federalStates.forEach(fs -> {
				federalStateNameMap.put(CoronaData.getKey(fs.getName()) + "-" + fs.getParent(), fs);
			});
		}
		
		return federalStateNameMap.get(name + "-" + parent);
	}
	
	public FederalState findByCode(String code) {
		if (federalStateCodeMap == null) {
			federalStateCodeMap = new HashMap<>();
			federalStates.forEach(fs -> {
				federalStateCodeMap.put(fs.getCode(), fs);
			});
		}
		
		return federalStateCodeMap.get(code);
	}
}
