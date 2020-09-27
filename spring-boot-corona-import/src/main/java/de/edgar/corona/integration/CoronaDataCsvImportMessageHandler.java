package de.edgar.corona.integration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.integration.handler.AbstractMessageHandler;
import org.springframework.messaging.Message;

import lombok.extern.slf4j.Slf4j;

/**
 * Send message to the integration flow process.
 * 
 * @author efurkert
 *
 */
@Slf4j
@Profile("!api")
public class CoronaDataCsvImportMessageHandler extends AbstractMessageHandler {
	
	@Autowired
	CoronaDataCsvImportGateway gateway;
	
	@Override
	protected void handleMessageInternal(Message<?> message) {
		log.info("Received message: " + message);
		gateway.handleFile(message);
	}

}
