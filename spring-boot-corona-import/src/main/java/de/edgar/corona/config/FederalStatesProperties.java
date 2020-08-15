package de.edgar.corona.config;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

import de.edgar.corona.model.FederalState;
import lombok.Data;

@Configuration
@ConfigurationProperties
@PropertySource(value="classpath:federalStates.yml", encoding="UTF-8", factory=YamlPropertySourceFactory.class)
@Data
public class FederalStatesProperties {

	private List<FederalState> federalStates;
	
	private Map<String, FederalState> federalStateKeyMap;
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
