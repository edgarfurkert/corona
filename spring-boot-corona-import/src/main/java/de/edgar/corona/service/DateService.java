package de.edgar.corona.service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.regex.Pattern;

import org.springframework.stereotype.Service;

@Service
public class DateService {

	private static String DATE_FORMAT = "yyyy-MM-dd";
	private static Pattern DATE_PATTERN = Pattern.compile("^\\d{4}-\\d{2}-\\d{2}$");

	public boolean matches(String date) {
		return DATE_PATTERN.matcher(date).matches();
	}

	public DateTimeFormatter getDateTimeFormatter() {
		return DateTimeFormatter.ofPattern(DATE_FORMAT);
	}
	
	public static String getDateString(LocalDate date) {
		return date.format(DateTimeFormatter.ofPattern(DATE_FORMAT));
	}
}
