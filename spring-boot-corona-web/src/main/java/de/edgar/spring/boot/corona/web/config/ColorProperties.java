package de.edgar.spring.boot.corona.web.config;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;

import lombok.Getter;

@Configuration
public class ColorProperties {
	
	@Autowired
	private CsvDataLoader csvDataLoader;
	
	@Getter
	private List<ColorProperty> colors;
	
	@Getter
	private List<String> hexRGBColors;
	
	private void loadColors() {
		hexRGBColors = new ArrayList<>();
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
		});
	}

	@PostConstruct
    private void setupData() {
        loadColors();
    }
}
