package de.edgar.corona.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

@Configuration
@ConfigurationProperties(prefix="germany")
@PropertySource(value="classpath:federalStates.yml", encoding="UTF-8", factory=YamlPropertySourceFactory.class)
public class GermanyFederalStatesProperties extends FederalStatesProperties {
}
