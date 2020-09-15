package de.edgar.spring.boot.corona.web.controller;

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
import de.edgar.spring.boot.corona.web.config.SessionConfig;
import de.edgar.spring.boot.corona.web.jpa.CoronaDataEntity;
import de.edgar.spring.boot.corona.web.jpa.CoronaDataJpaRepository;
import de.edgar.spring.boot.corona.web.model.CoronaDataSession;
import de.edgar.spring.boot.corona.web.model.OrderIdEnum;
import de.edgar.spring.boot.corona.web.model.Territory;
import de.edgar.spring.boot.corona.web.service.MessageSourceService;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequestMapping("/")
@SessionAttributes("coronaDataSession")
public class CoronaDataController {
	
	@Autowired
	private MessageSourceService messageSourceService;
	
	@Autowired
	private CoronaDataJpaRepository repo;

	@Autowired
	private CoronaDataCache cache;
	
	@Autowired
	private SessionConfig sessionConfig;

	@ModelAttribute(name = "coronaDataSession")
	public CoronaDataSession coronaDataSession() {
		CoronaDataSession cds = new CoronaDataSession();

		cds.setTerritoryParents(sessionConfig.getTerritoryParents());
		
		cds.setFromDate(sessionConfig.getFromDate());
		cds.setToDate(sessionConfig.getToDate());
		
		cds.setDataTypes(sessionConfig.getDataTypes(cds.getLocale()));
		cds.setDataCategories(sessionConfig.getDataCategories(cds.getLocale()));
		cds.setSelectedDataType("infections");
		cds.setSelectedDataCategory("cumulated");
		
		cds.setYAxisTypes(sessionConfig.getYAxisTypes(cds.getLocale()));
		cds.setSelectedYAxisType("linear");

		cds.setGraphTypes(sessionConfig.getGraphTypes(cds.getLocale()));
		cds.setSelectedGraphType("historical");
		
		
		log.debug("CoronaDataSession: " + cds);
		return cds;
	}
	
	@GetMapping
	public String showHomeView(Model model) {
		return "home";
	}
	
	@PostMapping
	public String getTerritories(@ModelAttribute CoronaDataSession cds) {
		
		List<String> territoryIds = repo.findDistinctTerritoryIdByTerritoryParent(cds.getSelectedTerritoryParents());
		List<Territory> territories = new ArrayList<>();
		Territory allTerritories = new Territory("all", messageSourceService.getMessage("allRegions", cds.getLocale()), 0L);
		territories.add(allTerritories);
		territoryIds.forEach(id -> {
			Optional<CoronaDataEntity> entity = repo.findFirstByTerritoryId(id);
			Long orderId = OrderIdEnum.UNKNOWN.getOrderId();
			if (entity.isPresent()) {
				if (entity.get().getOrderId() != null) {
					orderId = entity.get().getOrderId();
				}
			}
			String name = cache.getTerritoryName(id, cds.getLocale());
			territories.add(new Territory(id, name, orderId));
		});
		cds.setTerritories(territories);
		cds.getTerritories().sort(Comparator.comparing(Territory::getOrderId).thenComparing(Territory::getName));
		if (cds.getSelectedTerritories() != null) {
			cds.getSelectedTerritories().clear();
		}
		log.debug("CoronaDataSession: " + cds);
		
		return "home";
	}
	
	@GetMapping(path="/data")
	public String getDataGet(@ModelAttribute CoronaDataSession cds) {
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
