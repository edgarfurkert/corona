import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/internal/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import { NGXLogger } from 'ngx-logger';

import { Territory } from '../models/model.interfaces';
import { SERVICE_LOG_ENABLED } from '../app.tokens';
import { environment } from 'src/environments/environment';

const TERRITORIES: Territory[] = [
  { territoryId: 't1' , territoryName: 'T1', parentId: 'p1', parentName: 'P1', orderId: 1, 
    regions: [ 
      {territoryId: 't1.r1' , territoryName: 'T1.R1', parentId: 't1', parentName: 'T1', orderId: 10 },
      {territoryId: 't1.r2' , territoryName: 'T1.R2', parentId: 't1', parentName: 'T1', orderId: 10 }
    ]},
  { territoryId: 't2' , territoryName: 'T2', parentId: 'p1', parentName: 'P1', orderId: 1, 
    regions: [ 
      {territoryId: 't2.r1' , territoryName: 'T2.R1', parentId: 't2', parentName: 'T2', orderId: 10 },
      {territoryId: 't2.r2' , territoryName: 'T2.R2', parentId: 't2', parentName: 'T2', orderId: 10 },
      {territoryId: 't2.r3' , territoryName: 'T2.R3', parentId: 't2', parentName: 'T2', orderId: 10 }
    ]},
  { territoryId: 't3' , territoryName: 'T3', parentId: 'p2', parentName: 'P2', orderId: 1, 
    regions: [ 
      {territoryId: 't3.r1' , territoryName: 'T3.R1', parentId: 't3', parentName: 'T3', orderId: 10 },
      {territoryId: 't3.r2' , territoryName: 'T3.R2', parentId: 't3', parentName: 'T3', orderId: 10 },
      {territoryId: 't3.r3' , territoryName: 'T3.R3', parentId: 't3', parentName: 'T3', orderId: 10 },
      {territoryId: 't3.r4' , territoryName: 'T3.R4', parentId: 't3', parentName: 'T3', orderId: 10 }
    ]}
];

@Injectable({
  providedIn: 'root'
})
export class TerritoryService {

  private territories$ = new BehaviorSubject<Territory[]>([]);

  constructor(@Inject(SERVICE_LOG_ENABLED) private log: boolean, 
              private logger: NGXLogger,
              private http: HttpClient) { 
    /*
    TERRITORIES.forEach(t => {
      this.territoryMap.set(t.territoryId + '-' + t.parentId, t);
    });
    */
  }

  getTerritories(): Observable<Territory[]> {
    this.http.get<Territory[]>(environment.webApiBaseUrl + '/territories').pipe(
      tap((territories) => {
        if (this.log) {
          this.logger.debug('TerritoryService: territories', territories);
        }
        this.territories$.next(territories);
      })).subscribe();
    if (this.log) {
      this.logger.debug('TerritoryService: territories$', this.territories$);
    }

    return this.territories$.asObservable();
  }

}
