package de.edgar.spring.boot.corona.web.config;

import lombok.Data;

@Data
public class ColorProperty {

	private String name;
	private String hexRGB;   // #xxxxxx
	private String redRGB;   // red %
	private String greenRGB; // green %
	private String blueRGB;  // blue %
	private String hueHSLHSV;// hue (Farbwert) °
	// Hue / Saturation / Lightness
	private String saturHSL; // saturation HSL (Sättigung) %
	private String lightHSL; // lightness HSL (Helligkeit) %
	// Hue / Saturation / Value
	private String saturHSV; // saturation HSV (Sättigung) %
	private String valueHSV; // value HSV (Hellwert) %
	
}
