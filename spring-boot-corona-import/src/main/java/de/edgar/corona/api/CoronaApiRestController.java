package de.edgar.corona.api;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import de.edgar.corona.api.model.ApiDataInfo;
import de.edgar.corona.api.model.ApiDataSource;
import de.edgar.corona.api.model.ApiInfo;
import de.edgar.corona.api.model.ApiTerritoryInfo;
import de.edgar.corona.config.DownloadProperties;
import de.edgar.corona.jpa.CoronaDataEntity;
import de.edgar.corona.jpa.CoronaDataJpaRepository;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.publisher.SignalType;
import reactor.core.scheduler.Schedulers;

/**
 * REST controller to deliver information of supported data sources and data volume.
 * 
 * GET /datasources
 * GET /datainfo
 * 
 * @author efurkert
 *
 */
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
				
		ApiDataInfo dataInfo = getDataInfo();
		
		log.debug("CoronaApiRestController: GET datainfo: territories - {}", dataInfo.getTerritories().size());
		log.debug("CoronaApiRestController: GET datainfo -> {}", dataInfo);
		return Mono.just(dataInfo);
	}
	
	/* old implementation needs about 70s
	private ApiDataInfo getDataInfo() {
		ApiDataInfo dataInfo = new ApiDataInfo();
		
		dataInfo.setNumberOfRecords(repo.count());
		List<String> numberOfTerritoriesList = new ArrayList<>();
		repo.getTerritories().forEach(t -> {
			LocalDate minDate = repo.getMinDateRepByTerritoryIdAndTerritoryParent(t.getTerritoryId(), t.getTerritoryParent()).orElse(null);
			LocalDate maxDate = repo.getMaxDateRepByTerritoryIdAndTerritoryParent(t.getTerritoryId(), t.getTerritoryParent()).orElse(null);
			dataInfo.getTerritories().add(new ApiTerritoryInfo(t.getTerritoryId(), t.getTerritory(), t.getTerritoryParent(), t.getOrderId(), minDate, maxDate));
			String key = t.getTerritoryId() + "-" + t.getTerritory() + "-" + t.getTerritoryParent() + "-" + t.getOrderId();
			if (!numberOfTerritoriesList.contains(key)) {
				numberOfTerritoriesList.add(key);
			}
		});
		dataInfo.setNumberOfTerritories((long)numberOfTerritoriesList.size());

		return dataInfo;
	}
	*/

	/**
	 * New implementation needs about 60s
	 * 
	 * @return ApiDataInfo
	 */
	private ApiDataInfo getDataInfo() {
		ApiDataInfo dataInfo = new ApiDataInfo();
		
		dataInfo.setNumberOfRecords(repo.count());
		
		CompletableFuture<SignalType> future = new CompletableFuture<>();
		
		List<String> numberOfTerritoriesList = new ArrayList<>();
		Flux.fromIterable(repo.getTerritories())
				               .doOnNext(t -> {
				       			   String key = t.getTerritoryId() + "-" + t.getTerritory() + "-" + t.getTerritoryParent() + "-" + t.getOrderId();
				    			   if (!numberOfTerritoriesList.contains(key)) {
				    				   numberOfTerritoriesList.add(key);
				    			   }
				               })
							   .flatMap(e -> Mono.just(e)
									             .map(t -> {
									            	//log.debug("flatMap: {} - {}", Thread.currentThread().getName(), t);
									            	CoronaDataEntity minData = repo.findTopByTerritoryIdAndTerritoryParentOrderByDateRep(t.getTerritoryId(), t.getTerritoryParent()).orElse(null);
									            	CoronaDataEntity maxData = repo.findTopByTerritoryIdAndTerritoryParentOrderByDateRepDesc(t.getTerritoryId(), t.getTerritoryParent()).orElse(null);
								            	    return new ApiTerritoryInfo(t.getTerritoryId(), t.getTerritory(), t.getTerritoryParent(), t.getOrderId(), minData.getDateRep(), maxData.getDateRep(), maxData.getPopulation(), maxData.getCasesPer100000Pop(), maxData.getDeathsPer100000Pop());
									             })
									             .subscribeOn(Schedulers.parallel())
						       )
							   .doOnNext(i -> dataInfo.getTerritories().add(i))
							   .doFinally(s -> {
								   log.debug("CoronaApiRestController.getDataInfo: doFinally with signal type {}", s);
								   future.complete(s);
							   })
							   .subscribe();
		
		try {
			SignalType s = future.get();
			log.debug("CoronaApiRestController.getDataInfo: future get signal type {}", s);
		} catch (InterruptedException | ExecutionException e) {		
			log.error("CoronaApiRestController.getDataInfo: Exception {}", e);
		}
		
		dataInfo.setNumberOfTerritories((long)numberOfTerritoriesList.size());
		
		return dataInfo;
	}

	
	@GetMapping(path = "/check", produces = MediaType.APPLICATION_JSON_VALUE)
	public ApiInfo check(@RequestParam(name = "save", required = false) boolean save,
			             @RequestParam(name = "onlyNoData", required = false) boolean onlyNoData,
			             @RequestParam(name = "onlyWrongData", required = false) boolean onlyWrongData) {
		log.debug("CoronaApiRestController: GET check");
		
		ApiInfo info = new ApiInfo();
		
		List<CoronaDataEntity> territories = repo.getTerritories();
		
		long numberOfTerritories = territories.size();
		
		AtomicLong counter = new AtomicLong();
		territories.forEach(t -> {
			String i = "Analysing territory '" + t.getTerritoryId() + "'... (" + (counter.get()+1) + " von " + numberOfTerritories + ", " + ((counter.get() * 100) / numberOfTerritories + "%)");
			info.getInfo().add(i);
			log.info(i);
			Optional<LocalDate> minDate = repo.getMinDateRepByTerritoryIdAndTerritoryParent(t.getTerritoryId(), t.getTerritoryParent());
			Optional<LocalDate> maxDate = repo.getMaxDateRepByTerritoryIdAndTerritoryParent(t.getTerritoryId(), t.getTerritoryParent());
			if (minDate.isPresent() && maxDate.isPresent()) {
				List<CoronaDataEntity> entities = repo.findByTerritoryIdAndTerritoryParentAndDateRepBetweenOrderByDateRep(t.getTerritoryId(), t.getTerritoryParent(), minDate.get(), maxDate.get());
				Map<LocalDate, CoronaDataEntity> entityMap = new HashMap<>();
				entities.forEach(e -> {
					entityMap.put(e.getDateRep(), e);
				});
				CoronaDataEntity e, lastEntity = null;
				for (LocalDate d = minDate.get(); d.isBefore(maxDate.get()); d = d.plusDays(1)) {
					e = entityMap.get(d);
					if (e == null) {
						if (!onlyWrongData) {
							i = "No data for territory '" + t.getTerritoryId() + "' at " + d + ".";
							info.getInfo().add(i);
							log.info(i);
						}
					} else {
						if (lastEntity != null) {
							// check data
							boolean changes = false;
							Long lastCases = lastEntity.getCases();
							Long lastCasesKum = lastEntity.getCasesKum();
							Long cases = e.getCasesKum() - lastCasesKum;
							if (e.getCases() == null) {
								if (!onlyWrongData) {
									i = "No cases for territory '" + t.getTerritoryId() + "' at " + d + ": " + e.getCasesKum() + " != " + lastCasesKum + " + " + e.getCases() + "(" + lastEntity.getDateRep() + ")";
									info.getInfo().add(i);
									log.info(i);
								}
							} else if (!cases.equals(e.getCases())) {
								if (!onlyNoData) {
									i = "Wrong cases for territory '" + t.getTerritoryId() + "' at " + d + ": " + e.getCasesKum() + " != " + lastCasesKum + " + " + e.getCases() + "(" + lastEntity.getDateRep() + ")";
									info.getInfo().add(i);
									log.info(i);
								}
								
								e.setCases(cases);
								changes = true;
							}
							Long lastDeaths = lastEntity.getDeaths();
							Long lastDeathsKum = lastEntity.getDeathsKum();
							Long deaths = e.getDeathsKum() - lastDeathsKum;
							if (e.getDeaths() == null) {
								if (!onlyWrongData) {
									i = "No deaths for territory '" + t.getTerritoryId() + "' at " + d + ": " + e.getDeathsKum() + " != " + lastDeathsKum + " + " + e.getDeaths() + "(" + lastEntity.getDateRep() + ")";
									info.getInfo().add(i);
									log.info(i);
								}
							} else if (!deaths.equals(e.getDeaths())) {
								if (!onlyNoData) {
									i = "Wrong deaths for territory '" + t.getTerritoryId() + "' at " + d + ": " + e.getDeathsKum() + " != " + lastDeathsKum + " + " + e.getDeaths() + "(" + lastEntity.getDateRep() + ")";
									info.getInfo().add(i);
									log.info(i);
								}
								
								e.setDeaths(deaths);
								changes = true;
							}
							
							if (save && changes) {
								repo.save(e);
								log.info("Save: {}", e);
							}
						}
						lastEntity = e;
					}
				}
			}
			
			counter.incrementAndGet();
		});
		
		log.info("Analysis completed.");
		
		return info;
	}

}
