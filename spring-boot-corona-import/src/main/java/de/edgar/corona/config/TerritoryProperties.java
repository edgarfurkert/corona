package de.edgar.corona.config;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

import de.edgar.corona.model.Territory;
import lombok.Data;

@Configuration
@ConfigurationProperties
@PropertySource(value="classpath:territories.yml", encoding="UTF-8", factory=YamlPropertySourceFactory.class)
@Data
public class TerritoryProperties {
	
	private List<Territory> territories;
	
	private Map<String, Territory> territoryMap;
	
	public Territory findByKey(String key) {
		if (territoryMap == null) {
			territoryMap = new HashMap<>();
			territories.forEach(fs -> {
				territoryMap.put(fs.getTerritory(), fs);
			});
		}
		
		return territoryMap.get(key);
	}

}
