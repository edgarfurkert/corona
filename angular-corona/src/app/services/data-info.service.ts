import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/internal/operators';

import { environment } from 'src/environments/environment';
import { SERVICE_LOG_ENABLED } from '../app.tokens';
import { Territory } from '../models/model.interfaces';

export class DataInformation {
  numberOfRecords: number = 0;
  numberOfTerritories: number = 0;
  territories: Territory[] = [];
}

@Injectable({
  providedIn: 'root'
})
export class DataInfoService {

  private dataSources$ = new BehaviorSubject<any[]>([]);
  private dataInfo$ = new BehaviorSubject<DataInformation>(null);

  constructor(@Inject(SERVICE_LOG_ENABLED) private log: boolean, private http: HttpClient) { }

  getDataSources(): Observable<any[]> {
    this.http.get<any[]>(environment.importApiBaseUrl + '/datasources').pipe(
      tap((dataSources) => {
        if (this.log) {
          console.log('DataSourcesService: dataSources', dataSources);
        }
        this.dataSources$.next(dataSources);
      })).subscribe();
    if (this.log) {
      console.log('DataSourcesService: dataSources$', this.dataSources$);
    }

    return this.dataSources$.asObservable();
  }

  getInformation(): Observable<DataInformation> {
    this.http.get<DataInformation>(environment.importApiBaseUrl + '/datainfo').pipe(
      tap((dataInfo) => {
        if (this.log) {
          console.log('DataInfoService: dataInfo', dataInfo);
        }
        this.dataInfo$.next(dataInfo);
      })).subscribe();
    if (this.log) {
      console.log('DataInfoService: dataInfo$', this.dataInfo$);
    }

    return this.dataInfo$.asObservable();
  }
}
