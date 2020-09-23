import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/internal/operators';
import { NGXLogger } from 'ngx-logger';

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
  private dataSourcesSubscription: Subscription;
  private informationSubscription: Subscription;

  constructor(@Inject(SERVICE_LOG_ENABLED) private log: boolean, 
              private logger: NGXLogger, 
              private http: HttpClient) { }

  getDataSources(): Observable<any[]> {
    this.dataSourcesSubscription= this.http.get<any[]>(environment.importApiBaseUrl + '/datasources').pipe(
      tap((dataSources) => {
        if (this.log) {
          this.logger.debug('DataSourcesService: dataSources', dataSources);
        }
        this.dataSources$.next(dataSources);
        this.dataSources$.next([]);
      })).subscribe(() => this.dataSourcesSubscription.unsubscribe());
    if (this.log) {
      this.logger.debug('DataSourcesService: dataSources$', this.dataSources$);
    }

    return this.dataSources$.asObservable();
  }

  getInformation(): Observable<DataInformation> {
    this.informationSubscription = this.http.get<DataInformation>(environment.importApiBaseUrl + '/datainfo').pipe(
      tap((dataInfo) => {
        if (this.log) {
          this.logger.debug('DataInfoService: dataInfo', dataInfo);
        }
        this.dataInfo$.next(dataInfo);
        this.dataInfo$.next(null);
      })).subscribe(() => this.informationSubscription.unsubscribe());
    if (this.log) {
      this.logger.debug('DataInfoService: dataInfo$', this.dataInfo$);
    }

    return this.dataInfo$.asObservable();
  }
}
