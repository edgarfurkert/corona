package de.edgar.corona.config;

import java.io.InputStream;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.MappingIterator;
import com.fasterxml.jackson.dataformat.csv.CsvMapper;
import com.fasterxml.jackson.dataformat.csv.CsvSchema;

import de.edgar.corona.model.CoronaData;
import de.edgar.corona.model.GermanyCounty;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class GermanyCountyProperties {

	@Getter
	private Map<String, Long> populationMap  = new HashMap<>();
	
	@PostConstruct
    private void setupData() {
		List<GermanyCounty> counties = loadObjectList(GermanyCounty.class, "deutschland-landkreise.csv");
		counties.forEach(county -> {
			String type = null;
			switch (county.getType()) {
			case "Kreisfreie Stadt": type = "sk"; break;
			case "Stadtkreis": type = "sk"; break;
			case "Landkreis": type = "lk"; break;
			case "Regionalverband": type = "lk"; break;
			case "Kreis": type = "lk"; break;
			default: log.error("unknown type: {}", county.getType());
				break;
			}
			String name = county.getName().split(",")[0];
			name = name.replace("Regionalverband", "Stadtverband");
			name = name.replace("Städteregion", "Stadtregion");
			String key = CoronaData.getKey(type + " " + name);
			key = key.replace("lkLandsbergAmLech", "lkLandsbergA.lech");
			key = key.replace("skFreiburgImBreisgau", "skFreiburgI.breisgau");
			key = key.replace("lkStadtregionAachen", "stadtregionAachen");
			key = key.replace("lkRegionHannover", "regionHannover");
			key = key.replace("skMu00FClheimAnDerRuhr", "skMu00FClheimA.d.ruhr");
			key = key.replace("skNeustadtAnDerWeinstrau00DFe", "skNeustadtA.d.weinstrau00DFe");
			key = key.replace("lkSt.Wendel", "lkSanktWendel");
			key = key.replace("lkEifelkreisBitburgPru00FCm", "lkBitburgPru00FCm");
			key = key.replace("skLandauInDerPfalz", "skLandauI.d.pfalz");
			key = key.replace("skBrandenburgAnDerHavel", "skBrandenburgA.d.havel");
			populationMap.put(key, county.getPopulation());
		});
		populationMap.put("skBerlinNeuku00F6lln", Long.valueOf(329917));
		populationMap.put("skBerlinMitte", Long.valueOf(385748));
		populationMap.put("skBerlinTempelhofSchu00F6neberg", Long.valueOf(350984));
		populationMap.put("skBerlinMarzahnHellersdorf", Long.valueOf(269967));
		populationMap.put("skBerlinFriedrichshainKreuzberg", Long.valueOf(290386));
		populationMap.put("skBerlinPankow", Long.valueOf(409335));
		populationMap.put("skBerlinReinickendorf", Long.valueOf(266408));
		populationMap.put("skBerlinCharlottenburgWilmersdorf", Long.valueOf(343592));
		populationMap.put("skBerlinSpandau", Long.valueOf(245197));
		populationMap.put("skBerlinSteglitzZehlendorf", Long.valueOf(310071));
		populationMap.put("skBerlinLichtenberg", Long.valueOf(294201));
		populationMap.put("skBerlinTreptowKu00F6penick", Long.valueOf(273689));
    }
	
	private <T> List<T> loadObjectList(Class<T> type, String fileName) {
	    try {
	        CsvSchema bootstrapSchema = CsvSchema.emptySchema().withHeader().withColumnSeparator(';');
	        CsvMapper mapper = new CsvMapper();
	        InputStream is = new ClassPathResource(fileName).getInputStream();
	        MappingIterator<T> readValues = mapper.readerFor(type).with(bootstrapSchema).readValues(is);
	        return readValues.readAll();
	    } catch (Exception e) {
	        log.error("Error occurred while loading object list from file " + fileName, e);
	        return Collections.emptyList();
	    }
	}
	
}
