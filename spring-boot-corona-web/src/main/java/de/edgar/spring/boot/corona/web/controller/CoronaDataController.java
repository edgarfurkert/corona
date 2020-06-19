package de.edgar.spring.boot.corona.web.controller;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.SessionAttributes;

import de.edgar.spring.boot.corona.web.cache.CoronaDataCache;
import de.edgar.spring.boot.corona.web.jpa.CoronaDataEntity;
import de.edgar.spring.boot.corona.web.jpa.CoronaDataJpaRepository;
import de.edgar.spring.boot.corona.web.model.AxisType;
import de.edgar.spring.boot.corona.web.model.CoronaDataSession;
import de.edgar.spring.boot.corona.web.model.DataType;
import de.edgar.spring.boot.corona.web.model.GraphType;
import de.edgar.spring.boot.corona.web.model.OrderIdEnum;
import de.edgar.spring.boot.corona.web.model.Territory;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequestMapping("/")
@SessionAttributes("coronaDataSession")
public class CoronaDataController {
	
	@Autowired
	private CoronaDataJpaRepository repo;

	@Autowired
	private CoronaDataCache cache;

	@ModelAttribute(name = "coronaDataSession")
	public CoronaDataSession coronaDataSession() {
		CoronaDataSession cds = new CoronaDataSession();
		List<String> keys = repo.findDistinctTerritoryParent();
		keys.forEach(k -> {
			Optional<CoronaDataEntity> entity = repo.findFirstByTerritoryParent(k);
			Long orderId = OrderIdEnum.UNKNOWN.getOrderId();
			if (entity.isPresent()) {
				orderId = entity.get().getOrderId();
			}
			cds.getTerritoryParents().add(new Territory(k, k.replaceAll("_", " "), orderId));
		});
		cds.getTerritoryParents().sort(Comparator.comparing(Territory::getPrecision).thenComparing(Territory::getName));
		cds.setFromDate(repo.findTopByCasesGreaterThanOrderByDateRep(0L).get().getDateRep());
		cds.setToDate(LocalDate.now());
		List<DataType> dataTypes = new ArrayList<>();
		dataTypes.add(new DataType("infections", "Infections"));
		dataTypes.add(new DataType("infectionsPerDay", "Infections/Day"));
		dataTypes.add(new DataType("infectionsPer100000", "Infections/100.000"));
		dataTypes.add(new DataType("deaths", "Deaths"));
		dataTypes.add(new DataType("deathsPerDay", "Deaths/Day"));
		dataTypes.add(new DataType("deathsPer100000", "Deaths/100.000"));
		cds.setDataTypes(dataTypes);
		cds.setSelectedDataType("infections");
		
		List<AxisType> axisTypes = new ArrayList<>();
		axisTypes.add(new AxisType("numeric", "numeric"));
		axisTypes.add(new AxisType("logarithmic", "logarithmic"));
		cds.setYAxisTypes(axisTypes);
		cds.setSelectedYAxisType("numeric");

		List<GraphType> graphTypes = new ArrayList<>();
		graphTypes.add(new GraphType("line", "Historical"));
		graphTypes.add(new GraphType("bar", "Top 25"));
		graphTypes.add(new GraphType("infectionsDeaths", "Infections and deaths"));
		cds.setGraphTypes(graphTypes);
		cds.setSelectedGraphType("line");
		log.debug("CoronaDataSession: " + cds);
		return cds;
	}
	
	@GetMapping
	public String showHomeView(Model model) {
		return "home";
	}
	
	@PostMapping
	public String getTerritories(@ModelAttribute CoronaDataSession cds) {
		
		List<String> territoryKeys = repo.findDistinctTerritoryByTerritoryParent(cds.getSelectedTerritoryParents());
		List<Territory> territories = new ArrayList<>();
		Territory allTerritories = new Territory("all", "All Regions", 0L);
		territories.add(allTerritories);
		territoryKeys.forEach(k -> {
			Optional<CoronaDataEntity> entity = repo.findFirstByTerritory(k);
			Long orderId = OrderIdEnum.UNKNOWN.getOrderId();
			if (entity.isPresent()) {
				orderId = entity.get().getOrderId();
			}
			String name = cache.getTerritoryName(k);
			territories.add(new Territory(k, name, orderId));
		});
		cds.setTerritories(territories);
		cds.getTerritories().sort(Comparator.comparing(Territory::getPrecision).thenComparing(Territory::getName));
		if (cds.getSelectedTerritories() != null) {
			cds.getSelectedTerritories().clear();
		}
		log.debug("CoronaDataSession: " + cds);
		
		return "home";
	}
	
	@PostMapping(path="/data")
	public String getData(@ModelAttribute CoronaDataSession cds) {
		
		if (cds.getSelectedTerritories() != null && cds.getSelectedTerritories().contains("all")) {
			cds.getSelectedTerritories().clear();
			cds.getTerritories().forEach(t -> {
				if (!"all".equals(t.getKey())) {
					cds.getSelectedTerritories().add(t.getKey());
				}
			});
		}
		log.debug("selected territories: " + cds.getSelectedTerritories());
		log.debug("selected graph type: " + cds.getSelectedGraphType());
		log.debug("selected date type: " + cds.getSelectedDataType());

		return "home";
	}
}
