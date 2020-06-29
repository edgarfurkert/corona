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
		String name = t.replaceAll("_", " ");
		Optional<CoronaDataEntity> entity = repo.findFirstByTerritory(t);
		if (entity.isPresent()) {
			String parent = entity.get().getTerritoryParent();
			entity = repo.findFirstByTerritory(parent);
			if (entity.isPresent()) {
				String code = messageSourceService.getCode(t);
				name = messageSourceService.getMessage(code, l);
				String parentCode = messageSourceService.getCode(parent);
				String parentName = messageSourceService.getMessage(parentCode, l);
				name = name + " (" + parentName + ")";
			}
			log.debug(name);
		} else {
			log.error("Territory {} not found.", t);
		}
		return name;
	}


}
