import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/internal/operators';
import { NGXLogger } from 'ngx-logger';

import { SERVICE_LOG_ENABLED } from '../app.tokens';
import { environment } from 'src/environments/environment';

export interface KeyName {
  key: string;
  name?: string;
}

export class Configuration {
  fromDate: string;
  toDate: string;
  graphTypes: KeyName[];
  dataTypes: KeyName[];
  dataCategories: KeyName[];
  yaxisTypes: KeyName[];
}

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  private configuration$ = new BehaviorSubject<Configuration>(null);
  private httpSubscription: Subscription;

  constructor(@Inject(SERVICE_LOG_ENABLED) private log: boolean, 
              private logger: NGXLogger, 
              private http: HttpClient) { }

  getConfiguration(): Observable<Configuration> {
    this.httpSubscription = this.http.get<Configuration>(environment.webApiBaseUrl + '/configuration')
      .subscribe((configuration) => {
        if (this.log) {
          this.logger.debug('ConfigurationService: configuration', configuration);
        }
        this.configuration$.next(configuration);
        // clear subject
        this.configuration$.next(null);
        this.httpSubscription.unsubscribe();
      });
    if (this.log) {
      this.logger.debug('ConfigurationService: configuration$', this.configuration$);
    }

    return this.configuration$.asObservable();
  }

}
