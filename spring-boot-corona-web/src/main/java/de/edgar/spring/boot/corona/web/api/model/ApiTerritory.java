package de.edgar.spring.boot.corona.web.api.model;

import java.util.List;

import org.springframework.context.annotation.Profile;

import de.edgar.spring.boot.corona.web.jpa.CoronaDataEntity;
import lombok.Data;

@Profile("api")
@Data
public class ApiTerritory {
	private String territoryId;
	private String territoryName;
	private long orderId;
	private String parentId;
	private String parentName;
	
	private List<ApiTerritory> regions;
	
	public ApiTerritory() {	
	}
	
	public ApiTerritory(CoronaDataEntity e) {
		this.orderId = e.getOrderId();
		this.parentId = e.getTerritoryParent();
		this.territoryId = e.getTerritoryId();
		this.territoryName = e.getTerritory();
	}
}
