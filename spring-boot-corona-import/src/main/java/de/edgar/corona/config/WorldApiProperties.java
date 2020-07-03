package de.edgar.corona.config;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

import de.edgar.corona.model.CountryId;
import lombok.Data;

@Configuration
@ConfigurationProperties
@PropertySource(value="classpath:worldApi.yml", encoding="UTF-8", factory=YamlPropertySourceFactory.class)
@Data
public class WorldApiProperties {
	
	private List<CountryId> countries;
	
	private Map<String, CountryId> countryMap;
	
	public CountryId findByNameId(String key) {
		if (countryMap == null) {
			countryMap = new HashMap<>();
			countries.forEach(fs -> {
				countryMap.put(fs.getNameId(), fs);
			});
		}
		
		return countryMap.get(key);
	}

}
