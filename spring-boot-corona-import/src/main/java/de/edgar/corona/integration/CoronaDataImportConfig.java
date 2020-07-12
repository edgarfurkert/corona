package de.edgar.corona.integration;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.integration.annotation.InboundChannelAdapter;
import org.springframework.integration.annotation.Poller;
import org.springframework.integration.annotation.Router;
import org.springframework.integration.annotation.ServiceActivator;
import org.springframework.integration.channel.DirectChannel;
import org.springframework.integration.config.EnableIntegration;
import org.springframework.integration.core.MessageSource;
import org.springframework.integration.file.FileReadingMessageSource;
import org.springframework.integration.file.filters.SimplePatternFileListFilter;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessageHandler;

import de.edgar.corona.config.DownloadConfig;
import de.edgar.corona.config.DownloadProperties;
import de.edgar.corona.config.DownloadUrlProperty;
import de.edgar.corona.reactive.CoronaGermanyDataCsvImport;
import de.edgar.corona.reactive.CoronaGermanyFederalStatesDataCsvImport;
import de.edgar.corona.reactive.CoronaWorldDataCsvImport;
import de.edgar.corona.reactive.CoronaWorldDataJsonImport;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
@EnableIntegration
public class CoronaDataImportConfig {
	
	@Value( "${corona.data.import.path}" )
	private String importPath;
	
	@Autowired
	private DownloadProperties downloadProps;

	@Autowired
	private CoronaWorldDataJsonImport jsonImportWorldData;

	@Autowired
	private CoronaWorldDataCsvImport csvImportWorldData;
	
	@Autowired
	private CoronaGermanyDataCsvImport csvImportGermanyData;
	
	@Autowired
	private CoronaGermanyFederalStatesDataCsvImport csvImportGermanyFederalStatesData;
	
	@Bean
	public MessageChannel cvsFileInputChannel() {
		return new DirectChannel();
	}

	@Bean
	public MessageChannel jsonFileInputChannel() {
		return new DirectChannel();
	}

	@Bean
	public MessageChannel csvFileRouteChannel() {
		return new DirectChannel();
	}

	@Bean
	public MessageChannel jsonFileRouteChannel() {
		return new DirectChannel();
	}

	@Bean
	public MessageChannel worldChannel() {
		return new DirectChannel();
	}

	@Bean
	public MessageChannel germanyChannel() {
		return new DirectChannel();
	}

	@Bean
	public MessageChannel unknownChannel() {
		return new DirectChannel();
	}

	@Bean
	public MessageChannel errorChannel() {
		return new DirectChannel();
	}

	@Bean
	public MessageChannel doNothingChannel() {
		return new DirectChannel();
	}

	@Bean
    @InboundChannelAdapter(value = "csvFileInputChannel", poller = @Poller(fixedDelay = "${corona.data.import.poller}"))
    public MessageSource<File> csvFileReadingMessageSource() {
    	log.info("Reading csv-files in path: {}", importPath);
        FileReadingMessageSource sourceReader = new FileReadingMessageSource();
        sourceReader.setDirectory(new File(importPath));
        sourceReader.setFilter(new SimplePatternFileListFilter("*.csv"));
        return sourceReader;
    }

	@Bean
    @ServiceActivator(inputChannel= "csvFileInputChannel")
    public MessageHandler csvFileReadingMessageHandler() {
        return new CoronaDataCsvImportMessageHandler();
    }

	@Bean
    @InboundChannelAdapter(value = "jsonFileInputChannel", poller = @Poller(fixedDelay = "${corona.data.import.poller}"))
    public MessageSource<File> jsonFileReadingMessageSource() {
    	log.info("Reading csv-files in path: {}", importPath);
        FileReadingMessageSource sourceReader = new FileReadingMessageSource();
        sourceReader.setDirectory(new File(importPath));
        sourceReader.setFilter(new SimplePatternFileListFilter("*.json"));
        return sourceReader;
    }

	@Bean
    @ServiceActivator(inputChannel= "jsonFileInputChannel")
    public MessageHandler jsonFileReadingMessageHandler() {
        return new CoronaDataJsonImportMessageHandler();
    }

	@Router(inputChannel="csvFileRouteChannel")
	public String csvFileRouter(File file) {
		log.info("Router: file {}...", file.getName());
		String channel = "unknownChannel";
		try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
			String header = reader.readLine();
			header = header.replaceAll("[\\p{Cf}]", ""); // remove category of unicode characters.
			log.debug("Header      : {}", header);
			for (DownloadUrlProperty p : downloadProps.getUrls()) {
				log.debug("Header match: {}", p.getHeader());
				if (header.matches(p.getHeader())) {
					channel = p.getChannel();
					break;
				}
			};
		} catch (IOException e) {
			log.error("Router: {}", e.getMessage());
			return "errorChannel";
		}
		log.info("Router: route to channel {}", channel);
		return channel;
	}
    
	@Router(inputChannel="jsonFileRouteChannel")
	public String jsonFileRouter(File file) {
		log.info("Router: file {}...", file.getName());
		// check if csv import is done
		String channel = "worldApiChannel";
		for (DownloadUrlProperty p : downloadProps.getUrls()) {
			log.debug("Check channel: {}", p);
			if (channel.equals(p.getChannel()) && p.getAfterChannel() != null) {
				for (String c : p.getAfterChannel()) {
					log.debug("afterChannel: {}", c);
					for (DownloadUrlProperty p2 : downloadProps.getUrls()) {
						if (c.equals(p2.getChannel())) {
							String fn = importPath + "/" + DownloadConfig.getFileName(p2.getFileName()) + ".csv.in";
							File csvFile = new File(fn);
							if (!csvFile.exists()) {
								log.info("afterChannel: File {} does not exist.", fn);
								channel = "doNothingChannel";
								break;
							} else {
								log.info("afterChannel: File {} found.", fn);
							}
						}
					}
				}
				break;
			}
		}
		log.info("Router: route to channel {}", channel);
		return channel;
	}
    
	@Bean
    @ServiceActivator(inputChannel="worldApiChannel")
    public MessageHandler worldApiData() {
    	return message -> {
    		File file = (File)message.getPayload();
    		log.info("world api file data: {}", file.getAbsolutePath());
    		File inFile = new File(file.getAbsolutePath() + ".in");
    		if (file.renameTo(inFile)) {
        		jsonImportWorldData.importData(inFile.getAbsolutePath());
    		} else {
    			log.error("worldApiChannel: Cannot rename file {}", file.getAbsolutePath());
    		}
    	};
    }
    
	@Bean
    @ServiceActivator(inputChannel="worldChannel")
    public MessageHandler worldData() {
    	return message -> {
    		File file = (File)message.getPayload();
    		log.info("world file data: {}", file.getAbsolutePath());
    		File inFile = new File(file.getAbsolutePath() + ".in");
    		if (file.renameTo(inFile)) {
        		csvImportWorldData.importData(inFile.getAbsolutePath());
    		} else {
    			log.error("worldChannel: Cannot rename file {}", file.getAbsolutePath());
    		}
    	};
    }
    
	@Bean
    @ServiceActivator(inputChannel="germanyChannel")
    public MessageHandler germanyData() {
    	return message -> {
    		File file = (File)message.getPayload();
    		File inFile = new File(file.getAbsolutePath() + ".in");
    		if (file.renameTo(inFile)) {
        		csvImportGermanyData.importData(inFile.getAbsolutePath());
    		} else {
    			log.error("germanyChannel: Cannot rename file {}", file.getAbsolutePath());
    		}
    	};
    }
    
	@Bean
    @ServiceActivator(inputChannel="germanyFederalStatesChannel")
    public MessageHandler germanyFederalStatesData() {
    	return message -> {
    		File file = (File)message.getPayload();
    		File inFile = new File(file.getAbsolutePath() + ".in");
    		if (file.renameTo(inFile)) {
        		csvImportGermanyFederalStatesData.importData(inFile.getAbsolutePath());
    		} else {
    			log.error("germanyFederalStatesChannel: Cannot rename file {}", file.getAbsolutePath());
    		}
    	};
    }
    
	@Bean
    @ServiceActivator(inputChannel="unknownChannel")
    public MessageHandler unknownData() {
    	return message -> {
    		File file = (File)message.getPayload();
    		log.info("unknownChannel: Cannot handle file {}", file.getAbsolutePath());
    	};
    }
    
	@Bean
    @ServiceActivator(inputChannel="doNothingChannel")
    public MessageHandler doNothing() {
    	return message -> {
    		File file = (File)message.getPayload();
    		log.info("doNothingChannel: File {} ignored.", file.getAbsolutePath());
    	};
    }
    
	@Bean
    @ServiceActivator(inputChannel="errorChannel")
    public MessageHandler errorData() {
    	return message -> {
    		Exception e = (Exception)message.getPayload();
    		log.error("errorChannel: {}", e);
    	};
    }
}
