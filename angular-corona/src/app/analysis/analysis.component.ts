import { Component, OnInit, Inject, LOCALE_ID } from '@angular/core';
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
import { GraphService } from '../services/graph.service';
import { ANALYSIS_LOG_ENABLED } from '../app.tokens';
import { NgxSpinnerService } from 'ngx-spinner';
import { TimeRange } from '../time-range/time-range.component';


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

  regionsSelected: boolean = false;

  graphicTypes: SBChoice[] = [];
  selectedGraphicType = 'historical';

  dataTypes: RBChoice[] = [];
  selectedDataType = 'infections';

  dataCategories: RBChoice[] = [];
  selectedDataCategory = 'cumulated';

  yAxisTypes: RBChoice[] = [];
  selectedYAxisType = 'linear';

  territoriesLoaded: boolean = false;
  configurationLoaded: boolean = false;
  translationsLoaded: boolean = false;
  dataLoaded: boolean = false;
  allLoaded$: Observable<number> = timer(0, 100);
  allLoadedSubscription: Subscription;

  disabledYAxisTypes: string[] = [];

  translationMap: Map<string, string> = new Map<string, string>();

  constructor(private spinner: NgxSpinnerService,
    @Inject(LOCALE_ID) private locale: string,
    private logger: NGXLogger,
    @Inject(ANALYSIS_LOG_ENABLED) public log: boolean,
    private router: Router,
    private route: ActivatedRoute,
    private translationsService: TranslationsService,
    private territoryService: TerritoryService,
    private configurationService: ConfigurationService,
    private graphService: GraphService,
    private session: SessionService) {

    if (this.log) {
      this.logger.debug('AnalysisComponent: locale', this.locale);
      this.logger.debug('AnalysisComponent: log', this.log);
    }
    this.spinner.show('pleaseWait');
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
        this.spinner.hide('pleaseWait');
        this.allLoadedSubscription.unsubscribe();
      }
    });

    this.translationsService.getTranslations$().pipe(
      tap(t => {
        if (t) {
          this.translationMap = t;

          if (this.log) {
            this.logger.debug('AnalysisComponent.ngOnInit: translations loaded');
          }
          this.translationsLoaded = true;
          this.loadConfiguration();
          this.loadTerritories();
        } else {
          this.translationsService.getTranslations(this.locale);
        }
      })
    ).subscribe();

    // init session data
    this.session.set('territories', this.territories);
    this.session.set('regions', this.regions);
    this.session.set('startDate', this.startDate);
    this.session.set('endDate', this.endDate);
    this.session.set('graphicTypeSelected', this.selectedGraphicType);
    this.session.set('dataTypeSelected', this.selectedDataType);
    this.session.set('dataCategorySelected', this.selectedDataCategory);
    this.session.set('yAxisTypeSelected', this.selectedYAxisType);
    this.session.set('locale', this.locale);

    this.routeBySelection(this.selectedGraphicType);
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
        allTerritories.forEach(t => {
          t.parentName = this.getTranslation(t.parentId) || t.parentName;
          t.territoryName = this.getTranslation(t.territoryId) || t.territoryName;
          if (t.regions) {
            t.regions.forEach(r => {
              r.parentName = this.getTranslation(r.parentId) || r.parentName;
              r.territoryName = this.getTranslation(r.territoryId) || r.territoryName;
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
          if (t1.orderId < 100) {
            if (t1.parentName < t2.parentName) {
              return -1;
            }
            if (t1.parentName > t2.parentName) {
              return 1;
            }
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
          this.startDate = new Date(configuration.fromDate);
          this.session.set('startDate', this.startDate);
          this.endDate = new Date(configuration.toDate);
          this.session.set('endDate', this.endDate);
          this.maxDate = new Date(configuration.toDate);
          this.minDate = new Date(configuration.fromDate);

          // translation
          configuration.graphTypes.forEach(gt => {
            console.log(gt.key, this.getTranslation(gt.key))
            gt.name = this.getTranslation(gt.key) || gt.name;
            let graphicType: SBChoice = { id: gt.key, title: gt.name };
            this.graphicTypes.push(graphicType);
          });

          configuration.dataTypes.forEach(dt => {
            dt.name = this.getTranslation(dt.key) || dt.name;
            let dataType: RBChoice = { id: dt.key, title: dt.name };
            this.dataTypes.push(dataType);
          });

          configuration.dataCategories.forEach(dc => {
            dc.name = this.getTranslation(dc.key) || dc.name;
            let dataCategory: RBChoice = { id: dc.key, title: dc.name };
            this.dataCategories.push(dataCategory);
          });

          configuration.yaxisTypes.forEach(at => {
            at.name = this.getTranslation(at.key) || at.name;
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
        tArray.push(item);
      });
    });
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
    // set position
    let counter = 1;
    tArray.forEach(r => {
      r.position = counter;
      counter++;
      if (this.log) {
        this.logger.debug('AnalysisComponent.selectTerritory: item', r);
      }
    });
    // update region list
    setTimeout(() => {
      this.regions = tArray;
      this.session.set('regions', this.regions);
    });
  }

  selectRegion(selectedRegions: Territory[]) {
    if (this.log) {
      this.logger.debug('AnalysisComponent.selectRegion: selectedRegions', selectedRegions);
    }
    Promise.resolve(selectedRegions.length > 0).then((selected) => this.regionsSelected = selected);
    this.session.set('selectedRegions', selectedRegions);
  }

  update(data) {
    if (this.log) {
      this.logger.debug('AnalysisComponent.update: data', data);
    }
    this.spinner.show('dataLoading');
    this.graphService.loadGraphData();
    this.routeBySelection(this.selectedGraphicType);
  }

  changeTimeRange(timeRange: TimeRange) {
    if (this.log) {
      this.logger.debug('AnalysisComponent.changeTimeRange', timeRange);
    }
    this.session.set('startDate', timeRange.startDate);
    this.session.set('endDate', timeRange.endDate);
  }

  selectGraphicType(selection) {
    if (this.log) {
      this.logger.debug('AnalysisComponent.selectGraphicType', selection);
    }
    this.selectedGraphicType = selection;
    this.session.set('graphicTypeSelected', selection);

    switch (selection) {
      case 'top25Of':
      case 'startOf':
        // disable y-Axis type 'logarithmic'
        this.disabledYAxisTypes = ['logarithmic'];
        break;

      default:
        this.disabledYAxisTypes = [];
        break;
    }
    if (this.log) {
      this.logger.debug('AnalysisComponent.selectGraphicType: disabledYAxisTypes', this.disabledYAxisTypes);
    }
  }

  selectDataType(selection) {
    if (this.log) {
      this.logger.debug('AnalysisComponent.selectDataType', selection);
    }
    this.session.set('dataTypeSelected', selection);
  }

  selectDataCategory(selection) {
    if (this.log) {
      this.logger.debug('AnalysisComponent.selectDataCategory', selection);
    }
    this.session.set('dataCategorySelected', selection);
  }

  selectYAxisType(selection) {
    if (this.log) {
      this.logger.debug('AnalysisComponent.selectYAxisType', selection);
    }
    this.session.set('yAxisTypeSelected', selection);
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
          this.logger.debug('route selection done');
        }
      })
      .catch(error => {
        if (this.log) {
          this.logger.debug('route selection error', error);
        }
      });
  }
}
