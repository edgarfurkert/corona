package de.edgar.corona.integration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.integration.handler.AbstractMessageHandler;
import org.springframework.messaging.Message;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class CoronaDataJsonImportMessageHandler extends AbstractMessageHandler {
	
	@Autowired
	CoronaDataJsonImportGateway gateway;
	
	@Override
	protected void handleMessageInternal(Message<?> message) {
		log.info("Received message: " + message);
		gateway.handleFile(message);
	}

}
