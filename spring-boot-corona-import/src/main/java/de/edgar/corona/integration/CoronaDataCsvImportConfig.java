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

import de.edgar.corona.config.DownloadProperties;
import de.edgar.corona.config.DownloadUrlProperty;
import de.edgar.corona.reactive.CoronaGermanyDataCsvImport;
import de.edgar.corona.reactive.CoronaGermanyFederalStatesDataCsvImport;
import de.edgar.corona.reactive.CoronaWorldDataCsvImport;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
@EnableIntegration
public class CoronaDataCsvImportConfig {
	
	@Value( "${corona.data.csv.import.path}" )
	private String csvPath;
	
	@Autowired
	private DownloadProperties downloadProps;

	@Autowired
	private CoronaWorldDataCsvImport csvImportWorldData;
	
	@Autowired
	private CoronaGermanyDataCsvImport csvImportGermanyData;
	
	@Autowired
	private CoronaGermanyFederalStatesDataCsvImport csvImportGermanyFederalStatesData;
	
	@Bean
	public MessageChannel fileInputChannel() {
		return new DirectChannel();
	}

	@Bean
	public MessageChannel fileRouteChannel() {
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
    @InboundChannelAdapter(value = "fileInputChannel", poller = @Poller(fixedDelay = "${corona.data.csv.import.poller}"))
    public MessageSource<File> fileReadingMessageSource() {
    	log.info("Reading csv-files in path: " + csvPath);
        FileReadingMessageSource sourceReader = new FileReadingMessageSource();
        sourceReader.setDirectory(new File(csvPath));
        sourceReader.setFilter(new SimplePatternFileListFilter("*.csv"));
        return sourceReader;
    }

	@Bean
    @ServiceActivator(inputChannel= "fileInputChannel")
    public MessageHandler fileReadingMessageHandler() {
        return new CoronaDataCsvImportMessageHandler();
    }

	@Router(inputChannel="fileRouteChannel")
	public String fileRouter(File file) {
		log.info("Router: file " + file.getName() + "...");
		String channel = "unknownChannel";
		try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
			String line = reader.readLine();
			for (DownloadUrlProperty p : downloadProps.getUrls()) {
				if (line.equals(p.getHeader())) {
					channel = p.getChannel();
					break;
				}
			};
		} catch (IOException e) {
			log.error("Router: " + e.getMessage());
			return "errorChannel";
		}
		log.info("Router: route to channel " + channel);
		return channel;
	}
    
	@Bean
    @ServiceActivator(inputChannel="worldChannel")
    public MessageHandler worldData() {
    	return message -> {
    		File file = (File)message.getPayload();
    		log.info("world file data: " + file.getAbsolutePath());
    		File inFile = new File(file.getAbsolutePath() + ".in");
    		if (file.renameTo(inFile)) {
        		csvImportWorldData.importData(inFile.getAbsolutePath());
    		} else {
    			log.error("worldChannel: Cannot rename file " + file.getAbsolutePath());
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
    			log.error("germanyChannel: Cannot rename file " + file.getAbsolutePath());
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
    			log.error("germanyFederalStatesChannel: Cannot rename file " + file.getAbsolutePath());
    		}
    	};
    }
    
	@Bean
    @ServiceActivator(inputChannel="unknownChannel")
    public MessageHandler unknownData() {
    	return message -> {
    		File file = (File)message.getPayload();
    		log.error("unknownChannel: Cannot handle file " + file.getAbsolutePath());
    	};
    }
    
	@Bean
    @ServiceActivator(inputChannel="errorChannel")
    public MessageHandler errorData() {
    	return message -> {
    		File file = (File)message.getPayload();
    		log.error("errorChannel: Error while handle file " + file.getAbsolutePath());
    	};
    }
}
