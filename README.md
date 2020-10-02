# introduction
These projects were created during the Corona phase to get to know Spring 5, Spring Boot 2, Docker, Angular 7+ and Highcharts (https://www.highcharts.com/) better.
Inspired by the analysis of the Roylab Stats Youtube channel (Coronavirus Live Streaming) I developed my own (private) data analysis based on several data sources to follow the evolution of infections and death rates locally (Baden-Württemberg), in Germany, Europe and all over the world.

# spring-boot-corona-import
- download Corona data from multiple data sources:
  - https://opendata.ecdc.europa.eu/covid19/casedistribution/csv
  - https://covid19publicdata.blob.core.windows.net/rki/covid19-germany-federalstates.csv
  - https://covid19publicdata.blob.core.windows.net/rki/covid19-germany-counties.csv
  - https://api.covid19tracking.narrativa.com/api
  - https://raw.githubusercontent.com/daenuprobst/covid19-cases-switzerland/master/covid19_cases_switzerland_openzh.csv
  - https://raw.githubusercontent.com/daenuprobst/covid19-cases-switzerland/master/covid19_fatalities_switzerland_openzh.csv

- import data in a postgreSQL database

# spring-boot-corona-web
- show corona data in thymeleaf UI (using Highcharts graphics)

![corona web](https://github.com/edgarfurkert/corona/blob/master/examples/corona%20web%20-%2020201001.png)

# angular-corona
- show corona data (using Highcharts)
- usage of spring-boot-corona-import (profile: api) to get information of supported data dources and data volume
- usage of spring-boot-corona-web (profile: api) to get supported territories, regions, graphic types, data types and highcharts data

![corona1](https://github.com/edgarfurkert/corona/blob/master/examples/corona1%20-%2020201001.png)
![corona2](https://github.com/edgarfurkert/corona/blob/master/examples/corona2%20-%2020201001.png)
![corona3](https://github.com/edgarfurkert/corona/blob/master/examples/corona3%20-%2020201001.png)
![corona4](https://github.com/edgarfurkert/corona/blob/master/examples/corona4%20-%2020201001.png)
![corona data sources](https://github.com/edgarfurkert/corona/blob/master/examples/corona%20-%20datasources.png)
![corona info](https://github.com/edgarfurkert/corona/blob/master/examples/corona%20info%20-%2020201001.png)

# Raspberry Pi 4
I have built a docker environment on a Raspberry Pi 4, in which the individual services (database, data import, visualization, API) run.

![portainer](https://github.com/edgarfurkert/corona/blob/master/examples/raspi-portainer.png)
