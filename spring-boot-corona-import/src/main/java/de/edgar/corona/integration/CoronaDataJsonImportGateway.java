package de.edgar.corona.integration;

import org.springframework.context.annotation.Profile;
import org.springframework.integration.annotation.MessagingGateway;
import org.springframework.messaging.Message;

@Profile("!api")
@MessagingGateway(defaultRequestChannel="jsonFileRouteChannel")
public interface CoronaDataJsonImportGateway {

	void handleFile(Message<?> message);
	
}
