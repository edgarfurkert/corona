package de.edgar.corona.service;

import java.io.BufferedWriter;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStreamWriter;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.Properties;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.exc.InvalidFormatException;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class ExcelService {

	/*
	 * <strong> Convert Excel spreadsheet to CSV. Works for <strong>Excel 97-2003
	 * Workbook (<em>.xls) </strong> and <strong>Excel Workbook
	 * (</em>.xlsx)</strong>. Does not work for the <strong>XML Spreadsheet 2003
	 * (*.xml)</strong> format produced by BIRT.
	 * 
	 * @param fileName
	 * 
	 * @throws InvalidFormatException
	 * 
	 * @throws IOException
	 *
	 * @see http://bigsnowball.com/content/convert-excel-xlsx-and-xls-csv
	 */
	public void convertExcelToCSV(String excelFileName, String csvFileName, Properties props) throws InvalidFormatException, IOException {

		log.info("Converting {} to {}...", excelFileName, csvFileName);
		try (OutputStreamWriter writer = new OutputStreamWriter(new FileOutputStream(csvFileName), StandardCharsets.UTF_8);
	         BufferedWriter output = new BufferedWriter(writer)) {
			InputStream is = new FileInputStream(excelFileName);

			Workbook wb = WorkbookFactory.create(is);

			Sheet sheet = wb.getSheetAt(0);

			// hopefully the first row is a header and has a full compliment of
			// cells, else you'll have to pass in a max (yuck)
			int maxColumns = sheet.getRow(0).getLastCellNum();

			Charset sourceEncoding = StandardCharsets.ISO_8859_1;
			Charset targetEncoding = StandardCharsets.UTF_8;
			for (Row row : sheet) {

				// row.getFirstCellNum() and row.getLastCellNum() don't return the
				// first and last index when the first or last column is blank
				int minCol = 0; // row.getFirstCellNum()
				int maxCol = maxColumns; // row.getLastCellNum()

				for (int i = minCol; i < maxCol; i++) {

					Cell cell = row.getCell(i);
					String buf = "";
					if (i > 0) {
						buf = ",";
					}

					if (cell == null) {
						output.write(buf);
						// System.out.print(buf);
					} else {

						String v = null;

						switch (cell.getCellType()) {
						case STRING:
							v = new String(cell.getRichStringCellValue().getString().getBytes(sourceEncoding), targetEncoding);
							break;
						case NUMERIC:
							if (DateUtil.isCellDateFormatted(cell)) {
								if (props != null && props.get("dateFormat" + i) != null) {
									SimpleDateFormat format = new SimpleDateFormat((String)props.get("dateFormat" + i));
									v = format.format(cell.getDateCellValue());
								} else {
									v = cell.getDateCellValue().toString();
								}
							} else {
								if (props != null && props.get("decimalFormat" + i) != null) {
									String pattern = (String)props.get("decimalFormat" + i);
									DecimalFormat decimalFormat = new DecimalFormat(pattern);	
									v = decimalFormat.format(cell.getNumericCellValue());
								} else {
									v = String.valueOf(cell.getNumericCellValue());
								}
							}
							break;
						case BOOLEAN:
							v = String.valueOf(cell.getBooleanCellValue());
							break;
						case FORMULA:
							v = cell.getCellFormula();
							break;
						default:
						}

						if (v != null) {
							buf = buf + toCSV(v);
						}
						output.write(buf);
						// System.out.print(buf);
					}
				}

				output.write("\n");
				// System.out.println();
			}
			
			is.close();
			log.info("Convert finished.");
			
		} catch (IOException e) {
			log.error("Convert failed: {}", e.getMessage());
		}
		
	}

	/*
	 * </strong> Escape the given value for output to a CSV file. Assumes the value
	 * does not have a double quote wrapper.
	 * 
	 * @return
	 */
	private static String toCSV(String value) {

		String v = null;
		boolean doWrap = false;

		if (value != null) {

			v = value;

			if (v.contains("\"")) {
				v = v.replace("\"", "\"\""); // escape embedded double quotes
				doWrap = true;
			}

			if (v.contains(",") || v.contains("\n")) {
				doWrap = true;
			}

			if (doWrap) {
				v = "\"" + v + "\""; // wrap with double quotes to hide the comma
			}
		}

		return v;
	}
}
