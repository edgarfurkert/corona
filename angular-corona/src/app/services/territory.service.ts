import { Injectable, Inject } from '@angular/core';

import { Territory } from '../models/model.interfaces';
import { SERVICE_LOG_ENABLED } from '../app.tokens';

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

  private territoryMap: Map<string, Territory> = new Map<string, Territory>();

  constructor(@Inject(SERVICE_LOG_ENABLED) private log: boolean) { 
    TERRITORIES.forEach(t => {
      this.territoryMap.set(t.territoryId + '-' + t.parentId, t);
    });
    if (this.log) {
      console.log('TerritoryService: territoryMap', this.territoryMap);
    }
  }

  getTerritoryMap(): Map<string, Territory> {
    return this.territoryMap;
  }
}
