package de.edgar.corona.api;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

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
import reactor.core.publisher.SignalType;
import reactor.core.scheduler.Schedulers;

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
									     			LocalDate minDate = repo.getMinDateRepByTerritoryIdAndTerritoryParent(t.getTerritoryId(), t.getTerritoryParent()).orElse(null);
									    			LocalDate maxDate = repo.getMaxDateRepByTerritoryIdAndTerritoryParent(t.getTerritoryId(), t.getTerritoryParent()).orElse(null);									            	 
								            	    return new ApiTerritoryInfo(t.getTerritoryId(), t.getTerritory(), t.getTerritoryParent(), t.getOrderId(), minDate, maxDate);
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
}
