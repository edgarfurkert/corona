package de.edgar.corona.api;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import de.edgar.corona.api.model.ApiDataInfo;
import de.edgar.corona.api.model.ApiDataSource;
import de.edgar.corona.api.model.ApiTerritoryInfo;
import de.edgar.corona.config.DownloadProperties;
import de.edgar.corona.jpa.CoronaDataJpaRepository;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Slf4j
@Profile("api")
@RestController
@RequestMapping(path="/api", produces="application/json")
@CrossOrigin(origins="*")
@Transactional
public class CoronaApiRestController {

	@Autowired
	private DownloadProperties downloadProperties;
	
	@Autowired
	private CoronaDataJpaRepository repo;
	
	@GetMapping("/datasources")
	public Flux<ApiDataSource> dataSources() {
		log.debug("CoronaApiRestController: GET datasources");
		List<ApiDataSource> dataSources = new ArrayList<>();
		
		downloadProperties.getUrls().forEach(u -> {
			dataSources.add(new ApiDataSource(u.getUrl()));
		});
		log.debug("CoronaApiRestController: GET datasources -> {}", dataSources);
		return Flux.fromIterable(dataSources);
	}

	@GetMapping("/datainfo")
	public Mono<ApiDataInfo> dataInfo() {
		log.debug("CoronaApiRestController: GET datainfo");
		ApiDataInfo dataInfo = new ApiDataInfo();
		
		dataInfo.setNumberOfRecords(repo.count());
		dataInfo.setNumberOfTerritories(repo.countTerritories());
		repo.getTerritories().forEach(t -> {
			LocalDate minDate = repo.getMinDateRepByTerritoryIdAndTerritoryParent(t.getTerritoryId(), t.getTerritoryParent()).orElse(null);
			LocalDate maxDate = repo.getMaxDateRepByTerritoryIdAndTerritoryParent(t.getTerritoryId(), t.getTerritoryParent()).orElse(null);
			dataInfo.getTerritories().add(new ApiTerritoryInfo(t.getTerritoryId(), t.getTerritory(), t.getTerritoryParent(), minDate, maxDate));
		});
		
		log.debug("CoronaApiRestController: GET datainfo -> {}", dataInfo);
		return Mono.just(dataInfo);
	}

}
