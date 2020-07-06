package de.edgar.spring.boot.corona.web.cache;

import java.util.Locale;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import de.edgar.spring.boot.corona.web.jpa.CoronaDataEntity;
import de.edgar.spring.boot.corona.web.jpa.CoronaDataJpaRepository;
import de.edgar.spring.boot.corona.web.service.MessageSourceService;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class CoronaDataCache {
	
	@Autowired
	private CoronaDataJpaRepository repo;
	
	@Autowired
	private MessageSourceService messageSourceService;
		
    @Cacheable("territoryNames")
	public String getTerritoryName(String t, Locale l) {
		String name = t;
		Optional<CoronaDataEntity> entity = repo.findFirstByTerritoryId(t);
		if (entity.isPresent()) {
			String parent = entity.get().getTerritoryParent();
			name = messageSourceService.getMessage(t, l);
			String parentName = messageSourceService.getMessage(parent, l);
			name = name + " (" + parentName + ")";
			log.debug(name);
		} else {
			log.error("Territory {} not found.", t);
		}
		return name;
	}


}
