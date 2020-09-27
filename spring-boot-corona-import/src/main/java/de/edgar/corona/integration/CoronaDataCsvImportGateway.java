package de.edgar.corona.integration;

import org.springframework.context.annotation.Profile;
import org.springframework.integration.annotation.MessagingGateway;
import org.springframework.messaging.Message;

/**
 * Forward message to the csv file route channel. 
 * 
 * @author efurkert
 *
 */
@Profile("!api")
@MessagingGateway(defaultRequestChannel="csvFileRouteChannel")
public interface CoronaDataCsvImportGateway {

	void handleFile(Message<?> message);
	
}
