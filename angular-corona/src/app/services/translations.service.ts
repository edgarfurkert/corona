import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { tap } from 'rxjs/internal/operators';

import { SERVICE_LOG_ENABLED } from '../app.tokens';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TranslationsService {

  private translations: Map<string, string> = null;
  private translations$ = new BehaviorSubject<Map<string, string>>(null);

  constructor(@Inject(SERVICE_LOG_ENABLED) private log: boolean, private http: HttpClient) { }

  getTranslations(locale?: string): Observable<Map<string, string>> {
    const headers = new HttpHeaders().append('Content-Type', 'application/json');
    const params = new HttpParams().append('locale', locale);

    this.http.get<Map<string, string>>(environment.webApiBaseUrl + '/translations', {headers, params}).pipe(
      tap((translations) => {
        if (this.log) {
          console.log('TranslationsService: translations', translations);
        }
        this.translations = translations;
        this.translations$.next(new Map(Object.entries(translations)));
      })).subscribe();
    if (this.log) {
      console.log('TranslationsService: translations$', this.translations$);
    }

    return this.translations$.asObservable();
  }

  getTranslations$(): Observable<Map<string, string>> {
    return this.translations$;
  }
}
