import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/internal/operators';

import { NGXLogger } from 'ngx-logger';

import { SERVICE_LOG_ENABLED } from '../app.tokens';
import { SessionService } from './session.service';
import { Territory, TerritoryItem } from '../models/model.interfaces';
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
  historicalStackedAreasGraphData$ = new BehaviorSubject<Map<string, Object>>(null);
  infectionsAndGraphData$ = new BehaviorSubject<Map<string, Object>>(null);
  top25GraphData$ = new BehaviorSubject<Map<string, Object>>(null);
  startOfGraphData$ = new BehaviorSubject<Map<string, Object>>(null);

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
    (<TerritoryItem[]>this.sessionService.get('selectedRegions')).forEach(t => {
      gsd.selectedTerritories.push(t.data.territoryId);
      if (!gsd.selectedTerritoryParents.includes(t.data.parentId)) {
        gsd.selectedTerritoryParents.push(t.data.parentId);
      }
    });
    gsd.selectedYAxisType = <string>this.sessionService.get('yAxisTypeSelected');
    gsd.toDate = <Date>this.sessionService.get('endDate');

    if (this.log) {
      this.logger.debug('GraphService: session data', gsd);

    }
    this.http.post<any>(environment.webApiBaseUrl + "/graph", gsd).pipe(
      tap((graphData) => {
        if (this.log) {
          this.logger.debug('GraphService: graphData', graphData);
        }
        this.sessionService.set('graphData', graphData);
        this.sessionService.set('graphDataType', gsd.selectedGraphType);
        switch (gsd.selectedGraphType) {
          case 'historical':
            this.historicalGraphData$.next(new Map(Object.entries(graphData)));
            break;
          case 'historicalBubbles':
            this.historicalBubblesGraphData$.next(new Map(Object.entries(graphData)));
            break;
          case 'historicalStackedAreas':
            this.historicalStackedAreasGraphData$.next(new Map(Object.entries(graphData)));
            break;
          case 'infectionsAnd':
            this.infectionsAndGraphData$.next(new Map(Object.entries(graphData)));
            break;
          case 'top25Of':
            this.top25GraphData$.next(new Map(Object.entries(graphData)));
            break;
          case 'startOf':
            this.startOfGraphData$.next(new Map(Object.entries(graphData)));
            break;
          default:
            this.logger.error('GraphService: selectedGraphType not supported', gsd.selectedGraphType);
            break;
        }

      })
    ).subscribe();
  }

  updateGraph() {
    let selectedGraphType: string = <string>this.sessionService.get('graphDataType');
    let graphData: any = this.sessionService.get('graphData');
    if (graphData) {
      switch (selectedGraphType) {
        case 'historical':
          this.historicalGraphData$.next(new Map(Object.entries(graphData)));
          break;
        case 'historicalBubbles':
          this.historicalBubblesGraphData$.next(new Map(Object.entries(graphData)));
          break;
        case 'historicalStackedAreas':
          this.historicalStackedAreasGraphData$.next(new Map(Object.entries(graphData)));
          break;
        case 'infectionsAnd':
          this.infectionsAndGraphData$.next(new Map(Object.entries(graphData)));
          break;
        case 'top25Of':
          this.top25GraphData$.next(new Map(Object.entries(graphData)));
          break;
        case 'startOf':
          this.startOfGraphData$.next(new Map(Object.entries(graphData)));
          break;
        default:
          this.logger.error('GraphService: selectedGraphType not supported', selectedGraphType);
          break;
      }
    }
  }
}
