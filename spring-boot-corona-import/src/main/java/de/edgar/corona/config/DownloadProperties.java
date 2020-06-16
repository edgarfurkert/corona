package de.edgar.corona.config;

import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

import lombok.Data;

@Configuration
@ConfigurationProperties(prefix="corona.data.csv.download")
@PropertySource(value="classpath:application.yml", encoding="UTF-8", factory=YamlPropertySourceFactory.class)
@Data
public class DownloadProperties {
	
	private Long poller;
	private List<DownloadUrlProperty> urls;
	private Integer connectTimeout;
	private Integer readTimeout;
	
}
