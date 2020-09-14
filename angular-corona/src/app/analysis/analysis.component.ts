import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/internal/operators';
import { Observable, timer, Subscription } from 'rxjs';
import { NGXLogger } from 'ngx-logger';

import { Territory, TerritoryItem } from '../models/model.interfaces';
import { SBChoice } from '../selection-box/selection-box.component';
import { RBChoice } from '../radio-button-group/radio-button-group.component';
import { TerritoryService } from '../services/territory.service';
import { ConfigurationService } from '../services/configuration.service';
import { TranslationsService } from '../services/translations.service';
import { SessionService } from '../services/session.service';
import { ANALYSIS_LOG_ENABLED } from '../app.tokens';
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
  minDate: Date;
  territories: TerritoryItem[] = [];
  regions: TerritoryItem[] = [];

  graphicTypes: SBChoice[] = [];
  graphicTypeSelected = 'historical';

  dataTypes: RBChoice[] = [];
  dataTypeSelected = 'infections';

  dataCategories: RBChoice[] = [];
  dataCategorySelected = 'cumulated';

  yAxisTypes: RBChoice[] = [];
  yAxisTypeSelected = 'linear';

  territoriesLoaded: boolean = false;
  configurationLoaded: boolean = false;
  translationsLoaded: boolean = false;
  dataLoaded: boolean = false;
  allLoaded$: Observable<number> = timer(0, 100);
  allLoadedSubscription: Subscription;

  locale: string = 'de';
  translationMap: Map<string,string> = new Map<string,string>();

  constructor(private spinner: NgxSpinnerService,
    private logger: NGXLogger,
    @Inject(ANALYSIS_LOG_ENABLED) public log: boolean,
    private router: Router,
    private route: ActivatedRoute,
    private translationsService: TranslationsService,
    private territoryService: TerritoryService,
    private configurationService: ConfigurationService,
    private session: SessionService) {

    if (this.log) {
      this.logger.debug('AnalysisComponent');
    }
    this.spinner.show();
  }

  ngOnInit(): void {
    if (this.log) {
      this.logger.debug('AnalysisComponent.ngOnInit');
    }

    this.allLoadedSubscription = this.allLoaded$.subscribe(() => {
      this.dataLoaded = this.territoriesLoaded && this.configurationLoaded && this.translationsLoaded;
      if (this.dataLoaded) {
        if (this.log) {
          this.logger.debug('AnalysisComponent.ngOnInit: dataLoaded');
        }
        this.spinner.hide();
        this.allLoadedSubscription.unsubscribe();
      }
    });

    this.translationsService.getTranslations(this.locale).pipe(
      tap(t => {
        if (t) {
          this.translationMap = t;

          if (this.log) {
            this.logger.debug('AnalysisComponent.ngOnInit: translations loaded');
          }
          this.translationsLoaded = true;
          this.loadConfiguration();
          this.loadTerritories();
        }
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

  getTranslation(key: string) {
    return this.translationMap.get(key);
  }

  loadTerritories() {
    let tArray: TerritoryItem[] = [];
    this.territoryService.getTerritories().pipe(
      tap((allTerritories) => {
        // translation
        let translations = new Map<string,string>(Object.entries(this.session.get('translations')));

        allTerritories.forEach(t => {
          t.parentName = translations.get(t.parentId) || t.parentName;
          t.territoryName =  translations.get(t.territoryId) || t.territoryName;
          if (t.regions) {
            t.regions.forEach(r => {
              r.parentName = translations.get(r.parentId) || r.parentName;
              r.territoryName =  translations.get(r.territoryId) || r.territoryName;
            });
          }
        });

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
          this.logger.debug('AnalysisComponent.ngOnInit: territories', this.territories);
        }
        this.session.set('territories', this.territories);
        if (allTerritories.length > 0) {
          if (this.log) {
            this.logger.debug('AnalysisComponent.ngOnInit: territories loaded');
          }
          this.territoriesLoaded = true;
        }
      })
    ).subscribe();
  }

  loadConfiguration() {
    this.configurationService.getConfiguration().pipe(
      tap((configuration) => {
        if (configuration) {
          if (this.log) {
            this.logger.debug('AnalysisComponent.ngOnInit: configuration', configuration);
          }
          this.startDate = configuration.fromDate;
          this.session.set('startDate', this.startDate);
          this.endDate = configuration.toDate;
          this.session.set('endDate', this.endDate);
          this.maxDate = configuration.toDate;
          this.minDate = configuration.fromDate;

          // translation
          let translations = new Map<string,string>(Object.entries(this.session.get('translations')));

          configuration.graphTypes.forEach(gt => {
            console.log(gt.key, translations.get(gt.key))
            gt.name = translations.get(gt.key) || gt.name;
            let graphicType: SBChoice = { id: gt.key, title: gt.name };
            this.graphicTypes.push(graphicType);
          });

          configuration.dataTypes.forEach(dt => {
            dt.name = translations.get(dt.key) || dt.name;
            let dataType: RBChoice = { id: dt.key, title: dt.name };
            this.dataTypes.push(dataType);
          });

          configuration.dataCategories.forEach(dc => {
            dc.name = translations.get(dc.key) || dc.name;
            let dataCategory: RBChoice = { id: dc.key, title: dc.name };
            this.dataCategories.push(dataCategory);
          });

          configuration.yaxisTypes.forEach(at => {
            at.name = translations.get(at.key) || at.name;
            let axisType: RBChoice = { id: at.key, title: at.name };
            this.yAxisTypes.push(axisType);
          });

          if (configuration) {
            if (this.log) {
              this.logger.debug('AnalysisComponent.ngOnInit: configuration loaded');
            }
            this.configurationLoaded = true;
          }
        }
      })
    ).subscribe();
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
