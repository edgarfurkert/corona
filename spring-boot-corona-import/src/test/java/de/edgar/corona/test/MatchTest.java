package de.edgar.corona.test;

import static org.junit.Assert.assertNotNull;

import java.io.File;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.LineIterator;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import de.edgar.corona.config.DownloadProperties;

@SpringBootTest
class MatchTest {
	
	@Autowired
	private DownloadProperties props;

	private String getFileName(String urlFileName) {
		String now = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
		return urlFileName + "-" + now;
	}

	@Test
	void testMatch() {
		assertNotNull(props);
		
		String csvPath = "/home/efurkert/Downloads";
		props.getUrls().forEach(u -> {
		    String fileName = csvPath + "/" + getFileName(u.getFileName()) + ".download";
			System.out.println("fileName    : " + fileName);
		    File downloadFile = new File(fileName);
			assertNotNull(downloadFile);
			String header = null;
			try {
				LineIterator li = FileUtils.lineIterator(downloadFile, StandardCharsets.UTF_8.name());
				while (li.hasNext()) {
					header = li.next();
					break;
				}
			} catch (Exception e) {
				System.out.println(e.getMessage());
				return;
			}
			assertNotNull(header);
			header = header.replaceAll("[\\p{Cf}]", "");
			String h = "dateRep,day,month,year,cases,deaths,countriesAndTerritories,geoId,countryterritoryCode,popData2019,continentExp";
			for (int i = 0; i < header.length(); i++) {
				if (h.charAt(i) != header.charAt(i)) {
					System.out.println("char: " + h.charAt(i) + " != " + header.charAt(i) + "(" + (int)header.charAt(i) + ")");
				}
			}
			String p = u.getHeader();
			System.out.println("Header      : " + header);
			System.out.println("Header match: " + p);
			Pattern pattern = Pattern.compile(p);
			Matcher matcher = pattern.matcher(header);
			System.out.println("Header match: " + matcher.matches());
			System.out.println("Header match: " + header.matches(p));
		});
	}

}
