package de.edgar.corona.integration;

import org.springframework.integration.annotation.MessagingGateway;
import org.springframework.messaging.Message;

@MessagingGateway(defaultRequestChannel="csvFileRouteChannel")
public interface CoronaDataCsvImportGateway {

	void handleFile(Message<?> message);
	
}
