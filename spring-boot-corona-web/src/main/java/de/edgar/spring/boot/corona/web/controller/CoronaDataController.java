package de.edgar.spring.boot.corona.web.controller;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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
import de.edgar.spring.boot.corona.web.service.MessageSourceService;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequestMapping("/")
@SessionAttributes("coronaDataSession")
public class CoronaDataController {
	
	@Value( "${corona.data.daysToKum}" )
	private Integer daysToKum;

	@Autowired
	private MessageSourceService messageSourceService;
	
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
				if (entity.get().getOrderId() != null) {
					orderId = entity.get().getOrderId();
				}
			}
			String code = messageSourceService.getCode(k);
			if (log.isDebugEnabled()) {
				messageSourceService.getMessage(code, cds.getLocale());
			}
			cds.getTerritoryParents().add(new Territory(k, code, orderId));
		});
		cds.getTerritoryParents().sort(Comparator.comparing(Territory::getOrderId).thenComparing(Territory::getName));
		cds.setFromDate(repo.findTopByCasesGreaterThanOrderByDateRep(0L).get().getDateRep());
		cds.setToDate(LocalDate.now());
		List<DataType> dataTypes = new ArrayList<>();
		dataTypes.add(new DataType("infections", messageSourceService.getMessage("infections", cds.getLocale())));
		dataTypes.add(new DataType("infectionsPerDay", messageSourceService.getMessage("infectionsPerDay", cds.getLocale())));
		dataTypes.add(new DataType("infectionsPer100000", messageSourceService.getMessage("infectionsPer100000", cds.getLocale())));
		dataTypes.add(new DataType("infectionsPerDaysAnd100000",  messageSourceService.getMessage("infectionsPerDaysAnd100000", cds.getLocale(), daysToKum)));
		dataTypes.add(new DataType("deaths", messageSourceService.getMessage("deaths", cds.getLocale())));
		dataTypes.add(new DataType("deathsPerDay", messageSourceService.getMessage("deathsPerDay", cds.getLocale())));
		dataTypes.add(new DataType("deathsPer100000", messageSourceService.getMessage("deathsPer100000", cds.getLocale())));
		cds.setDataTypes(dataTypes);
		cds.setSelectedDataType("infections");
		
		List<AxisType> axisTypes = new ArrayList<>();
		axisTypes.add(new AxisType("linear", messageSourceService.getMessage("linear", cds.getLocale())));
		axisTypes.add(new AxisType("logarithmic", messageSourceService.getMessage("logarithmic", cds.getLocale())));
		cds.setYAxisTypes(axisTypes);
		cds.setSelectedYAxisType("linear");

		List<GraphType> graphTypes = new ArrayList<>();
		graphTypes.add(new GraphType("line", messageSourceService.getMessage("historical", cds.getLocale())));
		graphTypes.add(new GraphType("bubble", messageSourceService.getMessage("historicalBubbles", cds.getLocale())));
		graphTypes.add(new GraphType("infectionsDeaths", messageSourceService.getMessage("infectionsAndDeaths", cds.getLocale())));
		graphTypes.add(new GraphType("bar", messageSourceService.getMessage("top25Of", cds.getLocale())));
		graphTypes.add(new GraphType("stackedBar", messageSourceService.getMessage("startOf", cds.getLocale())));
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
		Territory allTerritories = new Territory("all", messageSourceService.getMessage("allRegions", cds.getLocale()), 0L);
		territories.add(allTerritories);
		territoryKeys.forEach(k -> {
			Optional<CoronaDataEntity> entity = repo.findFirstByTerritory(k);
			Long orderId = OrderIdEnum.UNKNOWN.getOrderId();
			if (entity.isPresent()) {
				if (entity.get().getOrderId() != null) {
					orderId = entity.get().getOrderId();
				}
			}
			String name = cache.getTerritoryName(k, cds.getLocale());
			territories.add(new Territory(k, name, orderId));
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
