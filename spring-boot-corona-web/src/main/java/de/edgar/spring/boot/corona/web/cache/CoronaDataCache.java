package de.edgar.spring.boot.corona.web.cache;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import de.edgar.spring.boot.corona.web.jpa.CoronaDataEntity;
import de.edgar.spring.boot.corona.web.jpa.CoronaDataJpaRepository;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class CoronaDataCache {
	
	@Autowired
	private CoronaDataJpaRepository repo;
		
    @Cacheable("territoryNames")
	public String getTerritoryName(String t) {
		String name = t.replaceAll("_", " ");
		Optional<CoronaDataEntity> entity = repo.findFirstByTerritory(t);
		if (entity.isPresent()) {
			String parent = entity.get().getTerritoryParent();
			entity = repo.findFirstByTerritory(parent);
			if (entity.isPresent()) {
				name = name + " (" + entity.get().getGeoId().replaceAll("_", " ") + ")";
			}
			log.debug(name);
		}
		return name;
	}


}
