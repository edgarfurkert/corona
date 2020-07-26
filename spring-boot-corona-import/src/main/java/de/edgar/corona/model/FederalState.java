package de.edgar.corona.model;

import lombok.Data;

@Data
public class FederalState {

	private String key;
	private String name;
	private String code;
	private Long population;
	private String parent;
	
}
