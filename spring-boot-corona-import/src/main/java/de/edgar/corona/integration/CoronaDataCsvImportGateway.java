package de.edgar.corona.integration;

import org.springframework.integration.annotation.MessagingGateway;
import org.springframework.messaging.Message;

@MessagingGateway(defaultRequestChannel="fileRouteChannel")
public interface CoronaDataCsvImportGateway {

	void handleFile(Message<?> message);
	
}
