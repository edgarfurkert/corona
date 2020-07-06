package de.edgar.spring.boot.corona.web.service;

import java.util.Locale;
import java.util.Optional;

import org.apache.commons.text.StringEscapeUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.NoSuchMessageException;
import org.springframework.stereotype.Service;

import de.edgar.spring.boot.corona.web.jpa.CoronaDataEntity;
import de.edgar.spring.boot.corona.web.jpa.CoronaDataJpaRepository;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class MessageSourceService {

	@Autowired
	private MessageSource messageSource;
	
	@Autowired
	private CoronaDataJpaRepository repo;
	
	public String getMessage(String code, Locale locale) {
		return getMessage(code, locale, "");
	}
	
	public String getMessage(String code, Locale locale, Object... params) {
		try {
			return messageSource.getMessage(code, params, locale);
		} catch (NoSuchMessageException e) {
			log.warn("Message code {} has no value for locale {}!", code, locale.toString());
			Optional<CoronaDataEntity> data = repo.findFirstByTerritoryId(code);
			if (data.isPresent()) {
				return data.get().getTerritory();
			}
		}
		
		return "<" + code + ">";
	}
	
	public String getCode(String text) {
		String[] tArray = text.split(",|\\(|\\)| |_|-");
		
		String code = "";
		boolean escape = true;
		for (int i = 0; i < tArray.length; i++) {
			if (i == 0) {
				code = tArray[i].toLowerCase();
				if ("lk".equals(code) || "sk".equals(code) || "region".equals(code) || "stadtregion".equals(code)) {
					code = text;
					escape = false;
					break;
				}
			} else if (tArray[i].length() > 0) {
				code += tArray[i].substring(0, 1).toUpperCase() + (tArray[i].length() > 1 ? tArray[i].substring(1).toLowerCase() : ""); 
			}
		}
		
		return escape ? StringEscapeUtils.escapeJava(code).replace("\\", "") : code;
	}
}
