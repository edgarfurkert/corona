package de.edgar.spring.boot.corona.web.api;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import de.edgar.spring.boot.corona.web.api.model.ApiConfiguration;
import de.edgar.spring.boot.corona.web.api.model.ApiTerritory;
import de.edgar.spring.boot.corona.web.config.SessionConfig;
import de.edgar.spring.boot.corona.web.jpa.CoronaDataJpaRepository;
import de.edgar.spring.boot.corona.web.model.CoronaDataSession;
import de.edgar.spring.boot.corona.web.model.GraphType;
import de.edgar.spring.boot.corona.web.model.charts.LineChartData;
import de.edgar.spring.boot.corona.web.service.GraphService;
import de.edgar.spring.boot.corona.web.service.MessageSourceService;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Slf4j
@RestController
@RequestMapping(path="/api", produces="application/json")
@CrossOrigin(origins="*")
@Transactional
public class CoronaApiRestController {
	
	@Autowired
	private CoronaDataJpaRepository repo;
	
	@Autowired
	private MessageSourceService messageSourceService;

	@Autowired
	private SessionConfig sessionConfig;
	
	@Autowired
	private GraphService graphService;

	@GetMapping("/territories")
	public Flux<ApiTerritory> territories() {
		log.debug("CoronaApiRestController: GET territories");
		Map<String, List<ApiTerritory>> parentMap = new HashMap<>();
		Map<String, ApiTerritory> territoryMap = new HashMap<>();
		repo.findDistinctTerritories().forEach(entity -> {
			log.debug("CoronaApiRestController: territories - {}", entity);
			List<ApiTerritory> territories = parentMap.get(entity.getTerritoryParent());
			if (territories == null) {
				territories = new ArrayList<>();
				parentMap.put(entity.getTerritoryParent(), territories);
			}
			ApiTerritory t = new ApiTerritory(entity);
			territories.add(t);
			territoryMap.put(entity.getTerritoryId(), t);
		});
		
		List<ApiTerritory> territories = new ArrayList<>();
		parentMap.keySet().forEach(parentId -> {
			ApiTerritory apiTerritory = new ApiTerritory();
			apiTerritory.setTerritoryId(parentId);
			ApiTerritory t = territoryMap.get(parentId);
			if (t != null) {
				apiTerritory.setOrderId(t.getOrderId());
				apiTerritory.setParentId(t.getParentId());
				apiTerritory.setParentName(t.getParentName());
				apiTerritory.setTerritoryName(t.getTerritoryName());
			}
			List<ApiTerritory> l = parentMap.get(parentId);
			if (l != null) {
				apiTerritory.setRegions(l);
			}
			territories.add(apiTerritory);
		});
		return Flux.fromIterable(territories);
	}

	@GetMapping("/configuration")
	public Mono<ApiConfiguration> configuration() {
		log.debug("CoronaApiRestController: GET configuration");
		
		ApiConfiguration config = new ApiConfiguration();
		config.setDataCategories(sessionConfig.getDataCategories(null));
		config.setDataTypes(sessionConfig.getDataTypes(null));
		config.setGraphTypes(sessionConfig.getGraphTypes(null));
		config.setYAxisTypes(sessionConfig.getYAxisTypes(null));
		config.setFromDate(sessionConfig.getFromDate());
		config.setToDate(sessionConfig.getToDate());

		return Mono.just(config);
	}

	@GetMapping("/translations")
	public Mono<Map<String, String>> translations(@RequestParam("locale") final Optional<Locale> locale) {
		log.debug("CoronaApiRestController: GET translations");
		
		Map<String, Object[]> params = new HashMap<>();
		Object[] daysToKum = new Object[1];
		daysToKum[0] = sessionConfig.getDaysToKum();
		params.put("chart.infectionsPerDaysAnd100000", daysToKum);
		params.put("perDaysAnd100000", daysToKum);
		Map<String, String> translations = messageSourceService.getMessages(locale.orElse(Locale.getDefault()), params);

		return Mono.just(translations);
	}
	
	/**
	 * Supported selectedGraphTypes:
	 * 	- historical
	 *  - historicalBubbles
	 *  - historicalStackedAreas
	 *  - infectionsAnd
	 *  - top25Of
	 *	- startOf
	 *
	 * @param cds CoronaDataSession
	 * @return graph data Mono
	 */
	@PostMapping("/graph")
	public Mono<Object> graph(@RequestBody CoronaDataSession cds) {
		log.debug("CoronaApiRestController: POST /graph - session data = {}", cds);
		
		switch (cds.getSelectedGraphType()) {
			case "historical":
				return Mono.just(graphService.getLineGraphData(cds));
				
			case "historicalBubbles":
				return Mono.just(graphService.getBubbleGraphData(cds));
				
			case "historicalStackedAreas":
				return Mono.just(graphService.getStackedAreaChartData(cds));
				
			case "infectionsAnd":
				return Mono.just(graphService.getInfectionsAndGraphData(cds));
				
			case "top25Of":
				return Mono.just(graphService.getBarGraphData(cds));
				
			case "startOf":
				return Mono.just(graphService.getStackedBarChartData(cds));
		}
		return Mono.just(null);
	}
}
