package de.edgar.spring.boot.corona.web.config;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;

import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
public class ColorProperties {
	
	@Autowired
	private CsvDataLoader csvDataLoader;
	
	@Getter
	private List<ColorProperty> colors;
	
	@Getter
	private List<ColorProperty> darkColors;
	
	@Getter
	private List<String> hexRGBColors;
	
	private void loadColors() {
		hexRGBColors = new ArrayList<>();
		darkColors = new ArrayList<>();
		colors = csvDataLoader.loadObjectList(ColorProperty.class, "colors.csv");
		colors.forEach(c -> {
			c.setBlueRGB(c.getBlueRGB().trim());
			c.setGreenRGB(c.getGreenRGB().trim());
			c.setHexRGB(c.getHexRGB().trim());
			c.setHueHSLHSV(c.getHueHSLHSV().trim());
			c.setLightHSL(c.getLightHSL().trim());
			c.setName(c.getName().trim());
			c.setRedRGB(c.getRedRGB().trim());
			c.setSaturHSL(c.getSaturHSL().trim());
			c.setSaturHSV(c.getSaturHSV().trim());
			c.setValueHSV(c.getValueHSV().trim());
			hexRGBColors.add(c.getHexRGB());
			
			try {
				if (Integer.parseInt(c.getLightHSL().replace("%", "")) <= 25) {
					darkColors.add(c);
				}
			} catch (NumberFormatException e) {
				log.error("ColorProperties.loadColors: exception {}", e.getMessage());
			}
		});
	}

	@PostConstruct
    private void setupData() {
        loadColors();
    }
}
