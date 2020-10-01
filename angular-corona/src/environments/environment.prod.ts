import { NgxLoggerLevel } from 'ngx-logger';

export const environment = {
  production: true,
  webApiBaseUrl: 'http://raspberrypi4:8100/api',
  importApiBaseUrl: 'http://raspberrypi4:8101/api',
  ngxLogLevel: NgxLoggerLevel.INFO,
  consoleLogEnabled: false,
  analysisLogEnabled: false,
  datainfoLogEnabled: false,
  serviceLogEnabled: false
};
