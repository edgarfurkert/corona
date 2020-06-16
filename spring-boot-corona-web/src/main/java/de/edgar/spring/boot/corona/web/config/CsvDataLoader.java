package de.edgar.spring.boot.corona.web.config;

import java.io.File;
import java.util.Collections;
import java.util.List;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.MappingIterator;
import com.fasterxml.jackson.dataformat.csv.CsvMapper;
import com.fasterxml.jackson.dataformat.csv.CsvSchema;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class CsvDataLoader {
	public <T> List<T> loadObjectList(Class<T> type, String fileName) {
		try {
			CsvSchema bootstrapSchema = CsvSchema.emptySchema().withHeader();
			CsvMapper mapper = new CsvMapper();
			File file = new ClassPathResource(fileName).getFile();
			MappingIterator<T> readValues = mapper.readerFor(type)
					                              .with(bootstrapSchema)
					                              .readValues(file);
			return readValues.readAll();
		} catch (Exception e) {
			log.error("Error occurred while loading object list from file " + fileName, e);
			return Collections.emptyList();
		}
	}
}
