package de.edgar.spring.boot.corona.web.config;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import de.edgar.spring.boot.corona.web.jpa.CoronaDataEntity;
import de.edgar.spring.boot.corona.web.jpa.CoronaDataJpaRepository;
import de.edgar.spring.boot.corona.web.model.AxisType;
import de.edgar.spring.boot.corona.web.model.DataType;
import de.edgar.spring.boot.corona.web.model.GraphType;
import de.edgar.spring.boot.corona.web.model.OrderIdEnum;
import de.edgar.spring.boot.corona.web.model.Territory;
import de.edgar.spring.boot.corona.web.service.MessageSourceService;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
public class SessionConfig {
	
	@Value( "${corona.data.daysToKum}" )
	private Integer daysToKum;

	@Autowired
	private MessageSourceService messageSourceService;

	@Autowired
	private CoronaDataJpaRepository repo;
	
	public Integer getDaysToKum() {
		return daysToKum;
	}

	public LocalDate getFromDate() {
		return repo.findTopByCasesGreaterThanOrderByDateRep(0L).get().getDateRep();
	}
	
	public LocalDate getToDate() {
		return LocalDate.now().minusDays(1);
	}
	
	public List<DataType> getDataTypes(Locale locale) {
		List<DataType> dataTypes = new ArrayList<>();
		dataTypes.add(new DataType("infections", messageSourceService.getMessage("infections", locale)));
		dataTypes.add(new DataType("deaths", messageSourceService.getMessage("deaths", locale)));
		dataTypes.add(new DataType("recovered", messageSourceService.getMessage("recovered", locale)));
		dataTypes.add(new DataType("active", messageSourceService.getMessage("active", locale)));
		return dataTypes;
	}
	
	public List<DataType> getDataCategories(Locale locale) {
		List<DataType> dataCategories = new ArrayList<>();
		dataCategories.add(new DataType("cumulated", messageSourceService.getMessage("cumulated", locale)));
		dataCategories.add(new DataType("perDay", messageSourceService.getMessage("perDay", locale)));
		dataCategories.add(new DataType("per100000", messageSourceService.getMessage("per100000", locale)));
		dataCategories.add(new DataType("perDaysAnd100000",  messageSourceService.getMessage("perDaysAnd100000", locale, daysToKum)));
		return dataCategories;
	}
	
	public List<AxisType> getYAxisTypes(Locale locale) {
		List<AxisType> axisTypes = new ArrayList<>();
		axisTypes.add(new AxisType("linear", messageSourceService.getMessage("linear", locale)));
		axisTypes.add(new AxisType("logarithmic", messageSourceService.getMessage("logarithmic", locale)));
		return axisTypes;
	}
	
	public List<GraphType> getGraphTypes(Locale locale) {
		List<GraphType> graphTypes = new ArrayList<>();
		graphTypes.add(new GraphType("historical", messageSourceService.getMessage("historical", locale)));
		graphTypes.add(new GraphType("historicalBubbles", messageSourceService.getMessage("historicalBubbles", locale)));
		graphTypes.add(new GraphType("historicalStackedAreas", messageSourceService.getMessage("historicalStackedAreas", locale)));
		graphTypes.add(new GraphType("infectionsAnd", messageSourceService.getMessage("infectionsAnd", locale)));
		graphTypes.add(new GraphType("top25Of", messageSourceService.getMessage("top25Of", locale)));
		graphTypes.add(new GraphType("startOf", messageSourceService.getMessage("startOf", locale)));
		return graphTypes;
	}
	
	public List<Territory> getTerritoryParents() {
		List<Territory> parents = new ArrayList<>();
		
		List<String> keys = repo.findDistinctTerritoryParent();
		keys.forEach(k -> {
			Optional<CoronaDataEntity> entity = repo.findFirstByTerritoryParent(k);
			Long orderId = OrderIdEnum.UNKNOWN.getOrderId();
			if (entity.isPresent()) {
				if (entity.get().getOrderId() != null) {
					orderId = entity.get().getOrderId();
				}
			}
			/*
			String code = messageSourceService.getCode(k);
			if (log.isDebugEnabled()) {
				messageSourceService.getMessage(code, cds.getLocale());
			}
			*/
			parents.add(new Territory(k, k, orderId));
		});
		parents.sort(Comparator.comparing(Territory::getOrderId).thenComparing(Territory::getName));
		
		return parents;
	}
}
