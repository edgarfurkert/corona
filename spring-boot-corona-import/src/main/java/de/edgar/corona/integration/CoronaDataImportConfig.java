package de.edgar.corona.integration;

import java.io.File;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
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
import de.edgar.corona.reactive.CoronaGermanyRkiDataCsvImport;
import de.edgar.corona.reactive.CoronaGermanyVaccinationDataCsvImport;
import de.edgar.corona.reactive.CoronaSwitzerlandCantonCasesDataCsvImport;
import de.edgar.corona.reactive.CoronaSwitzerlandCantonDeathsDataCsvImport;
import de.edgar.corona.reactive.CoronaWorldDataCsvImport;
import de.edgar.corona.reactive.CoronaWorldDataJsonImport;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Profile("!api")
@Configuration
@EnableIntegration
/**
 * Import process
 * 
 * InboundChannelAdapter(value = "csvFileInputChannel", poller = @Poller(fixedDelay = "${corona.data.import.poller}"))
 * 	-> ServiceActivator(inputChannel= "csvFileInputChannel")
 * 		-> MessageHandler: CoronaDataCsvImportMessageHandler
 * 			-> MessagingGateway(defaultRequestChannel="csvFileRouteChannel"): CoronaDataCsvImportGateway
 * 				-> Router(inputChannel="csvFileRouteChannel")
 * 					-> worldChannel 
 * 						-> ServiceActivator(inputChannel="worldChannel")
 * 							-> CoronaWorldDataCsvImport
 * 					-> germanyChannel
 * 						-> ServiceActivator(inputChannel="germanyChannel")
 * 							-> CoronaGermanyDataCsvImport
 * 					-> germanyFederalStatesChannel
 * 						-> ServiceActivator(inputChannel="germanyFederalStatesChannel")
 * 							-> CoronaGermanyFederalStatesDataCsvImport
 * 					-> germanyVaccinationChannel
 * 						-> ServiceActivator(inputChannel="germanyVaccinationChannel")
 * 							-> CoronaGermanyVaccinationDataCsvImport
 * 					-> worldApiChannel
 * 						-> ServiceActivator(inputChannel="worldApiChannel")
 * 							-> CoronaWorldDataCsvImport
 * 					-> switzerlandCasesChannel
 * 						-> ServiceActivator(inputChannel="switzerlandCasesChannel")
 * 							-> CoronaSwitzerlandCantonCasesDataCsvImport
 * 					-> switzerlandDeathsChannel
 * 						-> ServiceActivator(inputChannel="switzerlandDeathsChannel")
 * 							-> CoronaSwitzerlandCantonDeathsDataCsvImport
 * 					-> unknownChannel
 * 
 * @author efurkert
 *
 */
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
	private CoronaGermanyRkiDataCsvImport csvImportGermanyRkiData;
	
	@Autowired
	private CoronaGermanyDataCsvImport csvImportGermanyData;
	
	@Autowired
	private CoronaGermanyFederalStatesDataCsvImport csvImportGermanyFederalStatesData;
	
	@Autowired
	private CoronaGermanyVaccinationDataCsvImport csvImportGermanyVaccinationData;
	
	@Autowired
	private CoronaSwitzerlandCantonCasesDataCsvImport csvImportSwitzerlandCantonCasesData;
	
	@Autowired
	private CoronaSwitzerlandCantonDeathsDataCsvImport csvImportSwitzerlandCantonDeathsData;
	
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
	public MessageChannel germanyVaccinationChannel() {
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

	/**
	 * Read cyclic all csv files. If there are files, call corresponding message handler to process eath file.
	 * 
	 * @return FileReadingMessageSource
	 */
	@Bean
    @InboundChannelAdapter(value = "csvFileInputChannel", poller = @Poller(fixedDelay = "${corona.data.import.csv.poller}"))
    public MessageSource<File> csvFileReadingMessageSource() {
    	log.info("Reading csv-files in path: {}", importPath);
        FileReadingMessageSource sourceReader = new FileReadingMessageSource();
        sourceReader.setDirectory(new File(importPath));
        sourceReader.setFilter(new SimplePatternFileListFilter("*.csv"));
        return sourceReader;
    }

	/**
	 * Return message handler to handle csv files by the corresponding import gateway interface.
	 * 
	 * @return MessageHandler
	 */
	@Bean
    @ServiceActivator(inputChannel= "csvFileInputChannel")
    public MessageHandler csvFileReadingMessageHandler() {
        return new CoronaDataCsvImportMessageHandler();
    }

	@Bean
    @InboundChannelAdapter(value = "jsonFileInputChannel", poller = @Poller(fixedDelay = "${corona.data.import.json.poller}"))
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

	/**
	 * Route File object depending on the file name to the defined channel.
	 * 
	 * @param file
	 * @return channel
	 */
	@Router(inputChannel="csvFileRouteChannel")
	public String csvFileRouter(File file) {
		log.info("Router: file {}...", file.getName());
		String channel = "unknownChannel";
		for (DownloadUrlProperty p : downloadProps.getUrls()) {
			log.debug("File name match: {}", p.getFileName());
			if (file.getName().startsWith(p.getFileName())) {
				channel = p.getChannel();
				break;
			}
		};
		log.info("Router: route to channel {}", channel);
		return channel;
	}
    
	/**
	 * Route File object to channel "worldApiChannel" or "doNothingChannel" depending
	 * on the existence of the import files defined by the "afterChannels".
	 * (see application.yml) 
	 * 
	 * @param file
	 * @return channel
	 */
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
    
	/**
	 * Start import process.
	 * 
	 * @return MessageHandler
	 */
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
    
	/**
	 * Start import process.
	 * 
	 * @return MessageHandler
	 */
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
    
	/**
	 * Start import process.
	 * 
	 * @return MessageHandler
	 */
	@Bean
    @ServiceActivator(inputChannel="germanyRkiChannel")
    public MessageHandler germanyRkiData() {
    	return message -> {
    		File file = (File)message.getPayload();
    		File inFile = new File(file.getAbsolutePath() + ".in");
    		if (file.renameTo(inFile)) {
        		csvImportGermanyRkiData.importData(inFile.getAbsolutePath());
    		} else {
    			log.error("germanyRkiChannel: Cannot rename file {}", file.getAbsolutePath());
    		}
    	};
    }
    
	/**
	 * Start import process.
	 * 
	 * @return MessageHandler
	 */
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
    
	/**
	 * Start import process.
	 * 
	 * @return MessageHandler
	 */
	@Bean
    @ServiceActivator(inputChannel="germanyVaccinationChannel")
    public MessageHandler germanyVaccinationData() {
    	return message -> {
    		File file = (File)message.getPayload();
    		File inFile = new File(file.getAbsolutePath() + ".in");
    		if (file.renameTo(inFile)) {
        		csvImportGermanyVaccinationData.importData(inFile.getAbsolutePath());
    		} else {
    			log.error("germanyVaccinationChannel: Cannot rename file {}", file.getAbsolutePath());
    		}
    	};
    }
    
	/**
	 * Start import process.
	 * 
	 * @return MessageHandler
	 */
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
    
	/**
	 * Start import process.
	 * 
	 * @return MessageHandler
	 */
	@Bean
    @ServiceActivator(inputChannel="switzerlandCasesChannel")
    public MessageHandler switzerlandCasesData() {
    	return message -> {
    		File file = (File)message.getPayload();
    		File inFile = new File(file.getAbsolutePath() + ".in");
    		if (file.renameTo(inFile)) {
    			csvImportSwitzerlandCantonCasesData.importData(inFile.getAbsolutePath());
    		} else {
    			log.error("switzerlandCasesChannel: Cannot rename file {}", file.getAbsolutePath());
    		}
    	};
    }
    
	/**
	 * Start import process.
	 * 
	 * @return MessageHandler
	 */
	@Bean
    @ServiceActivator(inputChannel="switzerlandDeathsChannel")
    public MessageHandler switzerlandDeathsData() {
    	return message -> {
    		File file = (File)message.getPayload();
    		File inFile = new File(file.getAbsolutePath() + ".in");
    		if (file.renameTo(inFile)) {
    			csvImportSwitzerlandCantonDeathsData.importData(inFile.getAbsolutePath());
    		} else {
    			log.error("switzerlandDeathsChannel: Cannot rename file {}", file.getAbsolutePath());
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
