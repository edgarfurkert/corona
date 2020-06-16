package de.edgar.corona.config;

import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.LineIterator;
import org.apache.commons.io.input.ReversedLinesFileReader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.util.StringUtils;

import de.edgar.corona.jpa.CoronaDataJpaRepository;
import de.edgar.corona.model.CoronaData;
import de.edgar.corona.model.CoronaGermanyData;
import de.edgar.corona.model.CoronaGermanyFederalStateData;
import de.edgar.corona.model.CoronaWorldData;
import de.edgar.corona.model.Territory;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
@EnableScheduling
@EnableAsync
public class DownloadConfig {
	
	@Autowired
	private DownloadProperties props;
	
	@Autowired
	private GermanyFederalStatesProperties germanyProps;
	
	@Autowired
	private TerritoryProperties territoryProps;
	
	@Autowired
	private CoronaDataJpaRepository repository;

	@Value( "${corona.data.csv.import.path}" )
	private String csvPath;

    @Scheduled(fixedDelayString = "${corona.data.csv.download.poller}")
	public void downloadAsync() throws InterruptedException {
        log.info("Check download urls");
        
        DownloadUrlProperty downloadUrlProperty = null;
    	for (DownloadUrlProperty u : props.getUrls()) {
        	downloadUrlProperty = checkFiles(u);
        	if (downloadUrlProperty != null) {
        		downloadFile(downloadUrlProperty);
        	}
    	};
    }

    /**
     * Check if given file download is necessary.
     * 
     * @param u DownloadUrlProperty to check
     * @return DownloadUrlProperty or null if download is not necessary.
     */
	private DownloadUrlProperty checkFiles(DownloadUrlProperty u) {
		Path path = Paths.get(csvPath);
		DownloadUrlProperty downloadUrlProperty = null;
		try {
			String fileName = getFileName(u.getFileName());
			List<String> listFiles = Files.list(path)
				    .map(p -> p.getFileName().toString())
				    .filter(s -> s.startsWith(fileName))
				    .collect(Collectors.toList());
			
			if (listFiles.isEmpty()) {
				// no file found, download it
		        log.info("Download file {} not found, start download...", fileName);
				downloadUrlProperty = u;
			} else {
				log.info("Download not necessary, because file found: {}", listFiles.get(0));
			}
		} catch (IOException e) {
			log.error("Download check failed: " + e.getMessage());
		}
		return downloadUrlProperty;
	}
	
	/**
	 * Extend given filename with date of today.
	 * Format: <fileName>-yyyy-MM-dd 
	 *  
	 * @param urlFileName
	 * @return String extended filename
	 */
	private String getFileName(String urlFileName) {
		String now = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
		return urlFileName + "-" + now;
	}

	/**
	 * Download file from url (see application.yml).
	 * 
	 * @param downloadUrlProperty
	 */
	@Async
	private void downloadFile(DownloadUrlProperty downloadUrlProperty) {
		// download file
		int CONNECT_TIMEOUT = props.getConnectTimeout();
		int READ_TIMEOUT = props.getReadTimeout();
		try {
		    log.info("Download file from url {}...", downloadUrlProperty.getUrl());
		    String fileName = csvPath + "/" + getFileName(downloadUrlProperty.getFileName()) + ".download";
		    File downloadFile = new File(fileName);
		    FileUtils.copyURLToFile(new URL(downloadUrlProperty.getUrl()), downloadFile, CONNECT_TIMEOUT, READ_TIMEOUT);
		    log.info("Download finished: {}", fileName);
		    
		    log.info("Check actuality of file: {}", fileName);
		    // read header and first data line
		    String header = null, firstDataLine = null, lastDataLine = null;
			try {
				LineIterator li = FileUtils.lineIterator(downloadFile, StandardCharsets.UTF_8.name());
				while (li.hasNext()) {
					header = li.next();
					if (li.hasNext()) {
						firstDataLine = li.next();
					}
					break;
				}
			} catch (Exception e) {
				handleDownloadFile(downloadFile, e);
				return;
			}
			// read last data line
			try (ReversedLinesFileReader reversedReader = new ReversedLinesFileReader(downloadFile,	StandardCharsets.UTF_8)) {
				lastDataLine = reversedReader.readLine();
			} catch (IOException e) {
				handleDownloadFile(downloadFile, e);
				return;
			}
			if (StringUtils.isEmpty(header) || StringUtils.isEmpty(firstDataLine)) {
				handleDownloadFile(downloadFile, new DataIntegrityViolationException("No data found in file " + fileName));
				return;
			}
			log.debug("Header         : " + header);
			log.debug("First data line: " + firstDataLine);
			log.debug("Last data line : " + lastDataLine);
			
			// get channel of file
			String channel = null;
			for (DownloadUrlProperty p : props.getUrls()) {
				if (header.equals(p.getHeader())) {
					channel = p.getChannel();
					break;
				}
			};
			if (StringUtils.isEmpty(channel)) {
				handleDownloadFile(downloadFile, new DataIntegrityViolationException("Unknown header found in file " + fileName));
				return;
			}
			// check date by channel
			CoronaData cd;
			String territory = null;
			String territoryParent = null;
			switch (channel) {
			case "worldChannel":
				cd = new CoronaWorldData(firstDataLine);
				territory = cd.getTerritory();
				Territory t = territoryProps.findByKey(territory);
				if (t != null) {
					cd.setTerritoryParent(t.getTerritoryParent());
				}
				territoryParent = cd.getTerritoryParent();
				Optional<LocalDate> lastDate = repository.getMaxDateRepByTerritoryAndTerritoryParent(territory, territoryParent);
				if (lastDate.isPresent() && !lastDate.get().isBefore(cd.getDateRep())) {
					// there are no new data -> delete file
					handleDownloadFile(downloadFile, new Exception("No new data in file " + fileName));
					return;
				}
				break;
			case "germanyChannel":
				cd = new CoronaGermanyData(lastDataLine, germanyProps);
				territory = cd.getTerritory();
				territoryParent = cd.getTerritoryParent();
				lastDate = repository.getMaxDateRepByTerritoryAndTerritoryParent(territory, territoryParent);
				if (lastDate.isPresent() && !lastDate.get().isBefore(cd.getDateRep())) {
					// there are no new data -> delete file
					handleDownloadFile(downloadFile, new Exception("No new data in file " + fileName));
					return;
				}
				break;
			case "germanyFederalStatesChannel":
				cd = new CoronaGermanyFederalStateData(lastDataLine, germanyProps);
				territory = cd.getTerritory();
				territoryParent = cd.getTerritoryParent();
				lastDate = repository.getMaxDateRepByTerritoryAndTerritoryParent(territory, territoryParent);
				if (lastDate.isPresent() && !lastDate.get().isBefore(cd.getDateRep())) {
					// there are no new data -> delete file
					handleDownloadFile(downloadFile, new Exception("No new data in file " + fileName));
					return;
				}
				break;
			default:
				handleDownloadFile(downloadFile, new DataIntegrityViolationException("Unknown channel to handle file " + fileName));
				return;
			}
			
			// file with new data downloaded -> rename file to csv
		    File file = new File(fileName);
		    String renamedFileName = csvPath + "/" + getFileName(downloadUrlProperty.getFileName()) + ".csv";
		    File renamedFile = new File(renamedFileName);
		    
		    if (file.renameTo(renamedFile)) {
		        log.info("Download renamed: {}", renamedFileName);
		    } else {
		        log.info("Download rename failed: {}", fileName);
		    }
		    
		} catch (IOException e) {
		    log.error("Download of file {} failed: {}", downloadUrlProperty.getUrl(), e.getMessage());
		}
	}

	private void handleDownloadFile(File downloadFile, Exception e) {
		log.error("Error: " + e.getMessage());
		if (downloadFile.delete()) {
			log.info("File deleted: " + downloadFile.getAbsolutePath());
		}
	}
}
