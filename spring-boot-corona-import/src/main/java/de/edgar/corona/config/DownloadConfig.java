package de.edgar.corona.config;

import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.Properties;
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
import de.edgar.corona.service.ExcelService;
import de.edgar.corona.service.UpdateCheckService;
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
	
	@Autowired
	private UpdateCheckService updateCheckService;
	
	@Autowired
	private ExcelService excelService;

	@Value( "${corona.data.import.path}" )
	private String importPath;

    @Scheduled(fixedDelayString = "${corona.data.download.poller}")
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
		Path path = Paths.get(importPath);
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
	public static String getFileName(String urlFileName) {
		String now = dateToString(LocalDate.now());
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
		    String fileName = importPath + "/" + getFileName(downloadUrlProperty.getFileName()) + ".download";
		    File downloadFile = new File(fileName);
		    String downloadUrl = downloadUrlProperty.getUrl();
		    if ("worldApiChannel".equals(downloadUrlProperty.getChannel())) {
		    	handleWorldApiChannel(downloadUrlProperty);
		    	return;
		    } else {
			    FileUtils.copyURLToFile(new URL(downloadUrl), downloadFile, CONNECT_TIMEOUT, READ_TIMEOUT);
			    log.info("Download finished: {}", fileName);
		    }
		    
		    if (downloadUrlProperty.getUrl().endsWith(".xlsx")) {
		    	// handle excel file -> convert excel file to csv
		    	String csvFileName = fileName.replace("xlsx", "csv");
		    	Properties props = new Properties();
		    	props.put("dateFormat0", "dd/MM/yyyy");
		    	props.put("decimalFormat1", "#");
		    	props.put("decimalFormat2", "#");
		    	props.put("decimalFormat3", "#");
		    	props.put("decimalFormat4", "#");
		    	props.put("decimalFormat5", "#");
		    	props.put("decimalFormat9", "#");
		    	excelService.convertExcelToCSV(fileName, csvFileName, props);
		    	
		    	if (downloadFile.delete()) {
		    		log.info("File deleted: {}", fileName);
		    	} else {
		    		log.error("Cannot delete file: {}", fileName);
		    	}
		    	
		    	downloadFile = new File(csvFileName);
		    	fileName = csvFileName;
		    }
		    
		    log.info("Check actuality of file: {}", fileName);
		    // read header and first data line
		    String header = null, firstDataLine = null, lastDataLine = null;
			try {
				LineIterator li = FileUtils.lineIterator(downloadFile, StandardCharsets.UTF_8.name());
				while (li.hasNext()) {
					header = li.next();
					header = header.replaceAll("[\\p{Cf}]", ""); // remove category of unicode characters.
					if (li.hasNext()) {
						firstDataLine = li.next();
					}
					break;
				}
				li.close();
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
				log.debug("Header match   : " + p.getHeader());
				if (header.matches(p.getHeader())) {
					channel = p.getChannel();
					break;
				}
			};
			if (StringUtils.isEmpty(channel)) {
				handleDownloadFile(downloadFile, new DataIntegrityViolationException("Unknown header found in file " + fileName));
				return;
			}
			
			// check update file
			boolean filterDisabled = updateCheckService.checkUpdateFile(importPath, getFileName(downloadUrlProperty.getFileName()), false);
			
			if (!filterDisabled) {
				// check date by channel
				log.info("Update only new data.");
				CoronaData cd;
				String territoryParent = null;
				switch (channel) {
				case "worldChannel":
					cd = new CoronaWorldData(firstDataLine);
					Territory t = territoryProps.findByTerritoryId(cd.getTerritoryId());
					if (t != null) {
						cd.setTerritoryParent(t.getTerritoryParent());
					}
					territoryParent = cd.getTerritoryParent();
					Optional<LocalDate> lastDate = repository.getMaxDateRepByTerritoryIdAndTerritoryParent(cd.getTerritoryId(), territoryParent);
					if (lastDate.isPresent() && !lastDate.get().isBefore(cd.getDateRep())) {
						// there are no new data -> delete file
						handleDownloadFile(downloadFile, new Exception("No new data in file " + fileName));
						return;
					}
					break;
				case "germanyChannel":
					cd = new CoronaGermanyData(lastDataLine, germanyProps);
					territoryParent = cd.getTerritoryParent();
					lastDate = repository.getMaxDateRepByTerritoryIdAndTerritoryParent(cd.getTerritoryId(), territoryParent);
					if (lastDate.isPresent() && !lastDate.get().isBefore(cd.getDateRep())) {
						// there are no new data -> delete file
						handleDownloadFile(downloadFile, new Exception("No new data in file " + fileName));
						return;
					}
					break;
				case "germanyFederalStatesChannel":
					cd = new CoronaGermanyFederalStateData(lastDataLine, germanyProps);
					territoryParent = cd.getTerritoryParent();
					lastDate = repository.getMaxDateRepByTerritoryIdAndTerritoryParent(cd.getTerritoryId(), territoryParent);
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
			}
			
			// file with new data downloaded -> rename file to csv
		    renameFile(fileName, getFileName(downloadUrlProperty.getFileName()), "csv");
		    
		} catch (IOException e) {
		    log.error("Download of file {} failed: {}", downloadUrlProperty.getUrl(), e.getMessage());
		}
	}

	private void renameFile(String fromFullFileName, String toFileName, String fileExt) {
		File file = new File(fromFullFileName);
		String renamedFileName = toFileName + "." + fileExt;
		
		Path source = file.toPath();
		try {
		     Files.copy(source, source.resolveSibling(renamedFileName), StandardCopyOption.REPLACE_EXISTING);
	    	 log.info("File {} renamed to {}.", fromFullFileName, renamedFileName);
		     if (file.delete()) {
		    	 log.info("File {} deleted.", fromFullFileName);
		     } else {
		    	 log.info("Cannot delete file: {}", fromFullFileName);
		     }
		} catch (IOException e) {
		     log.error("Download rename failed: {}", fromFullFileName, e);
		}
	}

	private void handleDownloadFile(File downloadFile, Exception e) {
		log.error("Error: " + e.getMessage());
		if (downloadFile.delete()) {
			log.info("File deleted: " + downloadFile.getAbsolutePath());
		}
	}
	
	private static String dateToString(LocalDate date) {
		return date.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
	}
	
	private void handleWorldApiChannel(DownloadUrlProperty downloadUrlProperty) {
		int CONNECT_TIMEOUT = props.getConnectTimeout();
		int READ_TIMEOUT = props.getReadTimeout();
		
    	LocalDate fromDate = LocalDate.now();
    	
		// check update file
		boolean filterDisabled = updateCheckService.checkUpdateFile(importPath, getFileName(downloadUrlProperty.getFileName()), true);
		if (filterDisabled) {
			log.debug("{}: filter disabled", downloadUrlProperty.getFileName());
	    	Optional<LocalDate> minDate = repository.getMinDateRepByTerritoryIdAndTerritoryParent("world", "earth");
	    	if (minDate.isPresent()) {
	    		fromDate = minDate.get();
	    	}
		} else {
			log.debug("{}: filter enabled", downloadUrlProperty.getFileName());
		}
		
		// download data
    	LocalDate toDate = LocalDate.now();
    	String url, fileName, renameFileName;
    	File downloadFile;
    	for (LocalDate date = fromDate; date.isBefore(toDate) || date.isEqual(toDate); date = date.plusDays(1)) {
    		fileName = importPath + "/" + downloadUrlProperty.getFileName() + "-" + dateToString(date) + ".download";
    		downloadFile = new File(fileName);
	    	url = downloadUrlProperty.getUrl() + "/" + dateToString(date.minusDays(2));
		    try {
			    log.info("Download: {}", url);
				FileUtils.copyURLToFile(new URL(url), downloadFile, CONNECT_TIMEOUT, READ_TIMEOUT);
			    log.info("Download finished: {}", fileName);
			    renameFileName = downloadUrlProperty.getFileName() + "-" + dateToString(date);
			    renameFile(fileName, renameFileName, "json");
			} catch (Exception e) {
			    log.error("Download of file {} failed: {}", downloadUrlProperty.getUrl(), e.getMessage());
			}
    	}
	}
}
