package de.edgar.corona.config;

import java.util.List;

import lombok.Data;

@Data
public class DownloadUrlProperty {

	private String url;
	private String fileName;
	private String header;
	private String channel;
	private List<String> afterChannel;
	
}
