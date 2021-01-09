package de.edgar.corona.model;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class CoronaWorldData extends CoronaData {

	public CoronaWorldData() {
	}
	
	/**
	 * https://covid.ourworldindata.org/data/owid-covid-data.csv
	 * 
	 *  0. iso_code
     *  1. continent
	 *  2. location
	 *  3. date
	 *  4. total_cases
	 *  5. new_cases
	 *  6. new_cases_smoothed
	 *  7. total_deaths
	 *  8. new_deaths
	 *  9. new_deaths_smoothed
	 * 10. total_cases_per_million
	 * 11. new_cases_per_million
	 * 12. new_cases_smoothed_per_million
	 * 13. total_deaths_per_million
	 * 14. new_deaths_per_million
	 * 15. new_deaths_smoothed_per_million
	 * 16. reproduction_rate
	 * 17. icu_patients
	 * 18. icu_patients_per_million
	 * 19. hosp_patients
	 * 20. hosp_patients_per_million
	 * 21. weekly_icu_admissions
	 * 22. weekly_icu_admissions_per_million
	 * 23. weekly_hosp_admissions
	 * 24. weekly_hosp_admissions_per_million
	 * 25. new_tests
	 * 26. total_tests
	 * 27. total_tests_per_thousand
	 * 28. new_tests_per_thousand
	 * 29. new_tests_smoothed
	 * 30. new_tests_smoothed_per_thousand
	 * 31. positive_rate
	 * 32. tests_per_case
	 * 33. tests_units
	 * 34. total_vaccinations
	 * 35. new_vaccinations
	 * 36. total_vaccinations_per_hundred
	 * 37. new_vaccinations_per_million
	 * 38. stringency_index
	 * 39. population
	 * 40. population_density
	 * 41. median_age
	 * 42. aged_65_older
	 * 43. aged_70_older
	 * 44. gdp_per_capita
	 * 45. extreme_poverty
	 * 46. cardiovasc_death_rate
	 * 47. diabetes_prevalence
	 * 48. female_smokers
	 * 49. male_smokers
	 * 50. handwashing_facilities
	 * 51. hospital_beds_per_thousand
	 * 52. life_expectancy
	 * 53. human_development_index
     *
	 * @param line
	 */
	public CoronaWorldData(String line) {
		String[] a = line.split(",(?=([^\\\"]*\\\"[^\\\"]*\\\")*[^\\\"]*$)");
		/*
		setDay(getInteger(a[1]));
		setMonth(getInteger(a[2]));
		setYear(getInteger(a[3]));
		setDateRep(LocalDate.of(getYear(), getMonth(), getDay()));
		setCases(getLong(a[4]));
		setDeaths(getLong(a[5]));
		setTerritory(a[6].replaceAll("\"", ""));
		setTerritoryId(getKey(getTerritory()));
		setGeoId(a[7]);
		setTerritoryCode(a[8].length() > 0 ? a[8] : a[7]);
		setPopulation(getLong(a[9]));
		setTerritoryParent(getKey(a[10]));
		*/
		if (a.length < 40) {
			log.debug("Length: {} {}", a.length, line);
			setDateRep(LocalDate.now().plusDays(1)); // filter
			return;
		}
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
		LocalDate date = LocalDate.parse((a[3]), formatter);
		setDateRep(date);
		setDay(date.getDayOfMonth());
		setMonth(date.getMonthValue());
		setYear(date.getYear());
		setCases(getLong(a[5]));
		setCasesKum(getLong(a[4]));
		setDeaths(getLong(a[8]));
		setDeathsKum(getLong(a[7]));
		setTerritory(a[2].replaceAll("\"", ""));
		setTerritoryId(getKey(getTerritory()));
		setGeoId(a[0]);
		setTerritoryCode(a[0]);
		setPopulation(getLong(a[39]));
		setTerritoryParent(getKey(a[1]));
		setOrderId(OrderIdEnum.COUNTRY.getOrderId());
	}

	@Override
	public CoronaWorldData clone() throws CloneNotSupportedException {
		return (CoronaWorldData)super.clone();
	}
}
