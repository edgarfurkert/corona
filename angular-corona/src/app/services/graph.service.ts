import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/internal/operators';

import { NGXLogger } from 'ngx-logger';

import { SERVICE_LOG_ENABLED } from '../app.tokens';
import { SessionService } from './session.service';
import { Territory } from '../models/model.interfaces';
import { environment } from 'src/environments/environment';


export class GraphSessionData {
  locale: string;
  fromDate: Date;
  toDate: Date;
  selectedGraphType: string;
  selectedDataCategory: string;
  selectedDataType: string;
  selectedTerritories: string[];
  selectedTerritoryParents: string[];
  selectedYAxisType: string;
}

@Injectable({
  providedIn: 'root'
})
export class GraphService {

  historicalGraphData$ = new BehaviorSubject<Map<string, Object>>(null);
  historicalBubblesGraphData$ = new BehaviorSubject<Map<string, Object>>(null);

  constructor(@Inject(SERVICE_LOG_ENABLED) private log: boolean, 
              private logger: NGXLogger,
              private http: HttpClient, 
              private sessionService: SessionService) { }

  loadGraphData() {
    let gsd = new GraphSessionData();
    gsd.fromDate = <Date>this.sessionService.get('startDate');
    gsd.locale = <string>this.sessionService.get('locale');
    gsd.selectedGraphType = <string>this.sessionService.get('graphicTypeSelected');
    gsd.selectedDataCategory = <string>this.sessionService.get('dataCategorySelected');
    gsd.selectedDataType = <string>this.sessionService.get('dataTypeSelected');
    gsd.selectedTerritories = [];
    gsd.selectedTerritoryParents = [];
    (<Territory[]>this.sessionService.get('selectedRegions')).forEach(t => {
      gsd.selectedTerritories.push(t.territoryId);
      if (!gsd.selectedTerritoryParents.includes(t.parentId)) {
        gsd.selectedTerritoryParents.push(t.parentId);
      }
    });
    gsd.selectedYAxisType = <string>this.sessionService.get('yAxisTypeSelected');
    gsd.toDate = <Date>this.sessionService.get('endDate');

    if (this.log) {
      this.logger.debug('GraphService: session data', gsd);

    }
    this.http.post<Map<string, Object>>(environment.apiUrlGraph, gsd).pipe(
      tap((graphData) => {
        if (this.log) {
          this.logger.debug('GraphService: graphData', graphData);
        }
        switch(gsd.selectedGraphType) {
          default:
          case 'historical': this.historicalGraphData$.next(new Map(Object.entries(graphData)));
                             break;
          case 'historicalBubbles': this.historicalBubblesGraphData$.next(new Map(Object.entries(graphData)));
                             break;
        }
        
      })
    ).subscribe();
  }

}
