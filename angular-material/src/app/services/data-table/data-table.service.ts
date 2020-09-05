import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { PeriodicElement } from '../../models/data-table.model';
import { ElementStore } from '../stores/stores';
import { LOAD } from '../stores/generic-store';

@Injectable({
  providedIn: 'root'
})
export class DataTableService {

  elements$: BehaviorSubject<PeriodicElement[]>;

  constructor(private elementStore: ElementStore) { 
    this.elements$ = this.elementStore.items$;
  }

  setSelectedElements(elements: PeriodicElement[]) {
    if (JSON.stringify(elements) === JSON.stringify(this.elementStore.items_)){
      return;
    }
    console.log('DataTableService: setSelectedElements - dispatch', elements);

    const action = { type: LOAD, data: elements };
    this.elementStore.dispatch(action);
  }
}
