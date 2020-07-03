package de.edgar.corona.integration;

import org.springframework.integration.annotation.MessagingGateway;
import org.springframework.messaging.Message;

@MessagingGateway(defaultRequestChannel="jsonFileRouteChannel")
public interface CoronaDataJsonImportGateway {

	void handleFile(Message<?> message);
	
}
