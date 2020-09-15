import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/internal/operators';

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

  constructor(@Inject(SERVICE_LOG_ENABLED) private log: boolean, private http: HttpClient) { }

  getConfiguration(): Observable<Configuration> {
    this.http.get<Configuration>(environment.apiUrlConfiguration).pipe(
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
