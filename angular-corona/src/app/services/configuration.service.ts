import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/internal/operators';

import { SERVICE_LOG_ENABLED } from '../app.tokens';

const API_URL = 'http://localhost:8080/api/configuration';

export interface KeyName {
  key: string;
  name?: string;
}

export class Configuration {
  fromDate: Date;
  toDate: Date;
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

  constructor(@Inject(SERVICE_LOG_ENABLED) private log: boolean, private http: HttpClient) { }

  getConfiguration(): Observable<Configuration> {
    this.http.get<Configuration>(API_URL).pipe(
      tap((configuration) => {
        if (this.log) {
          console.log('ConfigurationService: configuration', configuration);
        }
        this.configuration$.next(configuration);
      })).subscribe();
    if (this.log) {
      console.log('ConfigurationService: configuration$', this.configuration$);
    }

    return this.configuration$.asObservable();
  }

}
