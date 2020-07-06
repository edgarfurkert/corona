package de.edgar.corona.service;

import java.io.File;

import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class UpdateCheckService {

	public boolean checkUpdateFile(String path, String fileName, boolean rename) {
		String f = fileName.replace(".csv.in", "").replace(".json.in", "");
		
		boolean updateFileAvailable = checkFile(path, f, rename);
		if (!updateFileAvailable) {
			f = f.substring(0, f.length()-11); // delete -JJJJ-MM-DD
			updateFileAvailable = checkFile(path, f, rename);
		}
		
		return updateFileAvailable;
	}
	
	private boolean checkFile(String path, String fileName, boolean rename) {
		String updateFileName = path + "/update." + fileName.replace(".csv.in", "").replace(".json.in", "");
		File updateFile = new File(updateFileName);
		boolean updateFileAvailable = false;
		log.info("Check file {}...", updateFileName);
		if (updateFile.exists() && updateFile.isFile()) {
			updateFileAvailable = true;
			log.info("Full update enabled because file {} found.", updateFileName);
			if (rename) {
				String updateFileNameDone = updateFileName + ".done";
				File updateFileDone = new File(updateFileNameDone);
				if (!updateFile.renameTo(updateFileDone)) {
					log.error("Cannot rename file {}", updateFileName);
				}
			}
		} else {
			log.info("Update only new data.");
		}	
		
		return updateFileAvailable;
	}
}
