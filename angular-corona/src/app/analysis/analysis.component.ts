import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/internal/operators';
import { NGXLogger } from 'ngx-logger';

import { Territory, TerritoryItem } from '../models/model.interfaces';
import { SBChoice } from '../selection-box/selection-box.component';
import { RBChoice } from '../radio-button-group/radio-button-group.component';
import { TerritoryService } from '../services/territory.service';
import { SessionService } from '../services/session.service';
import { ANALYSIS_LOG_ENABLED } from '../app.tokens';
import { Observable, BehaviorSubject } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'ef-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.scss']
})
export class AnalysisComponent implements OnInit {

  startDate: Date;
  endDate: Date;
  maxDate: Date;
  territories: TerritoryItem[] = [];
  regions: TerritoryItem[] = [];

  graphicTypes: SBChoice[] = [
    { id: 's1', title: 'Selection 1' },
    { id: 's2', title: 'Selection 2' },
    { id: 's3', title: 'Selection 3' }
  ];
  graphicTypeSelected = 's1';

  dataTypes: RBChoice[] = [
    { id: 'dt1', title: 'Data Type 1' },
    { id: 'dt2', title: 'Data Type 2' },
    { id: 'dt3', title: 'Data Type 3' }
  ];
  dataTypeSelected = 'dt1';

  dataCategories: RBChoice[] = [
    { id: 'dc1', title: 'Data Category 1' },
    { id: 'dc2', title: 'Data Category 2' },
    { id: 'dc3', title: 'Data Category 3' }
  ];
  dataCategorySelected = 'dc1';

  yAxisTypes: RBChoice[] = [
    { id: 'linear', title: 'linear' },
    { id: 'logarithmic', title: 'logarithmic' }
  ];
  yAxisTypeSelected = 'linear';

  constructor(private spinner: NgxSpinnerService, private logger: NGXLogger, @Inject(ANALYSIS_LOG_ENABLED) public log: boolean, private router: Router, private route: ActivatedRoute, private territoryService: TerritoryService, private session: SessionService) {
    if (this.log) {
      this.logger.debug('AnalysisComponent');
    }
  }

  ngOnInit(): void {
    if (this.log) {
      this.logger.debug('AnalysisComponent.ngOnInit');
    }
    this.spinner.show();

    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getDate() - 1);
    this.endDate = this.maxDate;

    let tArray: TerritoryItem[] = [];
    this.territoryService.getTerritories().pipe(
      tap((allTerritories) => {
        // sort territories
        allTerritories.sort((t1, t2) => {
          if (t1.orderId < t2.orderId) {
            return -1;
          }
          if (t1.orderId > t2.orderId) {
            return 1;
          }
          if (t1.territoryName < t2.territoryName) {
            return -1;
          }
          if (t1.territoryName > t2.territoryName) {
            return 1;
          }
          return 0;
        });
        var counter = 1;
        allTerritories.forEach(t => {
          let item = new TerritoryItem(t);
          item.position = counter;
          tArray.push(item);
          counter++;
        });

        this.territories = tArray;
        if (this.log) {
          this.logger.debug('AnalysisComponent.ngOnInit: territories$', this.territories);
        }
        this.spinner.hide();
      })
    ).subscribe();

    // init session data
    this.session.set('territories', this.territories);
    this.session.set('regions', this.regions);
    this.session.set('startDate', this.startDate);
    this.session.set('endDate', this.endDate);
    this.session.set('graphicTypeSelected', this.dataTypeSelected);
    this.session.set('dataTypeSelected', this.dataTypeSelected);
    this.session.set('dataCategorySelected', this.dataCategorySelected);
    this.session.set('yAxisTypeSelected', this.yAxisTypeSelected);
  }

  ngAfterViewInit() {
    if (this.log) {
      this.logger.debug('AnalysisComponent.ngAfterViewInit');
    }
  }

  selectTerritory(selectedTerritories: Territory[]) {
    if (this.log) {
      this.logger.debug('AnalysisComponent.selectTerritory', selectedTerritories);
    }
    let tArray: TerritoryItem[] = [];
    selectedTerritories.forEach(t => {
      t.regions.forEach(r => {
        let item = new TerritoryItem(r);
        if (this.log) {
          this.logger.debug('AnalysisComponent.selectTerritory: item', item);
        }
        tArray.push(item);
      });
    });
    setTimeout(() => {
      // sort territories
      tArray.sort((t1, t2) => {
        if (t1.data.orderId < t2.data.orderId) {
          return -1;
        }
        if (t1.data.orderId > t2.data.orderId) {
          return 1;
        }
        if (t1.data.territoryName < t2.data.territoryName) {
          return -1;
        }
        if (t1.data.territoryName > t2.data.territoryName) {
          return 1;
        }
        return 0;
      });
      this.regions = tArray;
      this.session.set('regions', this.regions);
    });
  }

  selectRegion(ev: Territory) {
    if (this.log) {
      this.logger.debug('AnalysisComponent.selectRegion: ev', ev);
    }
  }

  update(data) {
    if (this.log) {
      this.logger.debug('AnalysisComponent.update: data', data);
    }
    this.routeBySelection(this.graphicTypeSelected);
  }

  selectGraphicType(selection) {
    if (this.log) {
      this.logger.debug('AnalysisComponent.selectGraphicType', selection);
    }
    this.graphicTypeSelected = selection;
    this.session.set('graphicTypeSelected', this.dataTypeSelected);
  }

  selectDataType(selection) {
    if (this.log) {
      this.logger.debug('AnalysisComponent.selectDataType', selection);
    }
    this.dataTypeSelected = selection;
    this.session.set('dataTypeSelected', this.dataTypeSelected);
  }

  selectDataCategory(selection) {
    if (this.log) {
      this.logger.debug('AnalysisComponent.selectDataCategory', selection);
    }
    this.dataCategorySelected = selection;
    this.session.set('dataCategorySelected', this.dataCategorySelected);
  }

  selectYAxisType(selection) {
    if (this.log) {
      this.logger.debug('AnalysisComponent.selectYAxisType', selection);
    }
    this.yAxisTypeSelected = selection;
    this.session.set('yAxisTypeSelected', this.yAxisTypeSelected);
  }

  onGraphicActivate(ev) {
    if (this.log) {
      this.logger.debug('AnalysisComponent.onGraphicActivate', ev);
    }
  }

  onGraphicDeactivate(ev) {
    if (this.log) {
      this.logger.debug('AnalysisComponent.onGraphicDeactivate', ev);
    }
  }

  routeBySelection(selection: string) {
    if (this.log) {
      this.logger.debug('AnalysisComponent.routeBySelection', selection);
    }
    this.router.navigate([{ outlets: { graphic: [selection] } }], { relativeTo: this.route })
      .then(() => {
        if (this.log) {
          this.logger.debug('graphic done');
        }
      })
      .catch(error => {
        if (this.log) {
          this.logger.debug('graphic', error);
        }
      });
  }
}
