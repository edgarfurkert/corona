package de.edgar.corona.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GermanyCounty {
	private String id;
	private String type;
	private String name;
	private Long population;
}
