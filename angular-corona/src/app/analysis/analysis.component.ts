import { Component, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/internal/operators';
import { Observable, timer, Subscription, pipe } from 'rxjs';

import { NGXLogger } from 'ngx-logger';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';

import { Territory, TerritoryItem } from '../models/model.interfaces';
import { SBChoice } from '../selection-box/selection-box.component';
import { RBChoice } from '../radio-button-group/radio-button-group.component';
import { TerritoryService } from '../services/territory.service';
import { ConfigurationService } from '../services/configuration.service';
import { TranslationsService } from '../services/translations.service';
import { SessionService } from '../services/session.service';
import { GraphService } from '../services/graph.service';
import { ANALYSIS_LOG_ENABLED } from '../app.tokens';
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
  selectedTerritories: TerritoryItem[] = [];
  regions: TerritoryItem[] = [];
  selectedRegions: TerritoryItem[] = [];

  regionsSelected: boolean = false;

  graphicTypes: SBChoice[] = [];
  selectedGraphicType = 'historical';

  dataTypes: RBChoice[] = [];
  selectedDataType = 'infections';

  dataCategories: RBChoice[] = [];
  selectedDataCategory = 'cumulated';

  yAxisTypes: RBChoice[] = [];
  selectedYAxisType = 'linear';

  configurationLoaded: boolean = false;
  territoriesLoaded: boolean = false;
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
    if (<boolean>this.session.get('dataLoaded')) {
      this.restoreFromSession();
      this.spinner.hide('pleaseWait');
    }
  }

  ngOnInit(): void {
    if (this.log) {
      this.logger.debug('AnalysisComponent.ngOnInit');
    }

    let sessionDate: Date = new Date(this.session.get('date'));
    let today: Date = new Date();
    if (sessionDate.getDay !== today.getDay) {
      if (this.log) {
        this.logger.debug('AnalysisComponent.ngOnInit: reload min/maxDate');
      }
      this.spinner.show('pleaseWait');
      this.dataLoaded = false;
      this.configurationLoaded = false;
      this.session.set('configurationLoaded', this.configurationLoaded);
      this.loadMinMaxDate();
    }

    if (!this.dataLoaded) {
      this.allLoadedSubscription = this.allLoaded$.subscribe(() => {
        this.dataLoaded = <boolean>this.session.get('territoriesLoaded') && <boolean>this.session.get('configurationLoaded') && <boolean>this.session.get('translationsLoaded');
        this.session.set('dataLoaded', this.dataLoaded);
        if (this.dataLoaded) {
          if (this.log) {
            this.logger.debug('AnalysisComponent.ngOnInit: dataLoaded');
          }
          this.spinner.hide('pleaseWait');
          this.allLoadedSubscription.unsubscribe();
        }
      });
    }

    if (!this.translationsLoaded) {
      // init session data
      this.initSession();

      this.translationsService.getTranslations$().pipe(
        tap(t => {
          if (t) {
            if (this.log) {
              this.logger.debug('AnalysisComponent.ngOnInit: translations loaded');
            }

            this.translationMap = t;
            this.session.set('translations', JSON.stringify(Array.from(t.entries())));
            this.session.set('translationsLoaded', true);
            this.loadConfiguration();
            this.loadTerritories();
          } else {
            this.translationsService.getTranslations(this.locale);
          }
        })
      ).subscribe();
    }

    let graphDataType = <string>this.session.get('graphDataType');
    this.routeBySelection(graphDataType ? graphDataType : this.selectedGraphicType);
  }

  ngAfterViewInit() {
    if (this.log) {
      this.logger.debug('AnalysisComponent.ngAfterViewInit');
    }
  }

  initSession() {
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
  }

  restoreFromSession() {
    this.locale = <string>this.session.get('locale');
    this.translationMap = new Map<string,string>(JSON.parse(this.session.get('translations')));

    this.territories = <TerritoryItem[]>this.session.get('territories');
    this.selectedTerritories = <TerritoryItem[]>this.session.get('selectedTerritories');
    this.regions = <TerritoryItem[]>this.session.get('regions');
    this.selectedRegions = <TerritoryItem[]>this.session.get('selectedRegions');

    this.startDate = <Date>this.session.get('startDate');
    this.endDate = <Date>this.session.get('endDate');
    this.minDate = <Date>this.session.get('minDate');
    this.maxDate = <Date>this.session.get('maxDate');

    this.graphicTypes = <SBChoice[]>this.session.get('graphicTypes');
    this.yAxisTypes = <RBChoice[]>this.session.get('yAxisTypes');
    this.dataTypes = <RBChoice[]>this.session.get('dataTypes');
    this.dataCategories = <RBChoice[]>this.session.get('dataCategories');

    this.selectedGraphicType = <string>this.session.get('graphicTypeSelected');
    this.selectedDataType = <string>this.session.get('dataTypeSelected');
    this.selectedDataCategory = <string>this.session.get('dataCategorySelected');
    this.selectedYAxisType = <string>this.session.get('yAxisTypeSelected');
    this.disabledYAxisTypes = <string[]>this.session.get('disabledYAxisTypes');

    this.dataLoaded = <boolean>this.session.get('dataLoaded');
    this.translationsLoaded = <boolean>this.session.get('translationsLoaded');
    this.configurationLoaded = <boolean>this.session.get('configurationLoaded');
    this.territoriesLoaded = <boolean>this.session.get('territoriesLoaded');

    this.graphService.updateGraph();
  }

  getTranslation(key: string) {
    return this.translationMap.get(key);
  }

  loadTerritories() {
    if (!this.territoriesLoaded) {
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
            this.session.set('territoriesLoaded', true);
          }
        })
      ).subscribe();
    }
  }

  loadMinMaxDate() {
    if (!this.configurationLoaded) {
      this.configurationService.getConfiguration().pipe(
        tap((configuration) => {
          if (configuration) {
            if (this.log) {
              this.logger.debug('AnalysisComponent.loadMinMaxDate: configuration', configuration);
            }
            this.maxDate = new Date(configuration.toDate);
            this.session.set('maxDate', this.maxDate);
            this.minDate = new Date(configuration.fromDate);
            this.session.set('minDate', this.minDate);

            if (this.log) {
              this.logger.debug('AnalysisComponent.loadMinMaxDate: configuration loaded');
            }
            this.configurationLoaded = true;
            this.session.set('configurationLoaded', true);
          }
        })
      ).subscribe();
    }
  }

  loadConfiguration() {
    if (!this.configurationLoaded) {
      this.configurationService.getConfiguration().pipe(
        tap((configuration) => {
          if (configuration) {
            if (this.log) {
              this.logger.debug('AnalysisComponent.loadConfiguration: configuration', configuration);
            }
            this.startDate = new Date(configuration.fromDate);
            this.session.set('startDate', this.startDate);
            this.endDate = new Date(configuration.toDate);
            this.session.set('endDate', this.endDate);
            this.maxDate = new Date(configuration.toDate);
            this.session.set('maxDate', this.maxDate);
            this.minDate = new Date(configuration.fromDate);
            this.session.set('minDate', this.minDate);

            // translation
            configuration.graphTypes.forEach(gt => {
              console.log(gt.key, this.getTranslation(gt.key))
              gt.name = this.getTranslation(gt.key) || gt.name;
              let graphicType: SBChoice = { id: gt.key, title: gt.name };
              this.graphicTypes.push(graphicType);
            });
            this.session.set('graphicTypes', this.graphicTypes);

            configuration.dataTypes.forEach(dt => {
              dt.name = this.getTranslation(dt.key) || dt.name;
              let dataType: RBChoice = { id: dt.key, title: dt.name };
              this.dataTypes.push(dataType);
            });
            this.session.set('dataTypes', this.dataTypes);

            configuration.dataCategories.forEach(dc => {
              dc.name = this.getTranslation(dc.key) || dc.name;
              let dataCategory: RBChoice = { id: dc.key, title: dc.name };
              this.dataCategories.push(dataCategory);
            });
            this.session.set('dataCategories', this.dataCategories);

            configuration.yaxisTypes.forEach(at => {
              at.name = this.getTranslation(at.key) || at.name;
              let axisType: RBChoice = { id: at.key, title: at.name };
              this.yAxisTypes.push(axisType);
            });
            this.session.set('yAxisTypes', this.yAxisTypes);

            if (this.log) {
              this.logger.debug('AnalysisComponent.loadConfiguration: configuration loaded');
            }
            this.configurationLoaded = true;
            this.session.set('configurationLoaded', true);
          }
        })
      ).subscribe();
    }
  }

  selectTerritory(selectedTerritories: Territory[]) {
    if (this.log) {
      this.logger.debug('AnalysisComponent.selectTerritory', selectedTerritories);
    }

    let selected: TerritoryItem[] = [];
    let tArray: TerritoryItem[] = [];
    selectedTerritories.forEach(t => {
      selected.push(new TerritoryItem(t));

      t.regions.forEach(r => {
        let item = new TerritoryItem(r);
        tArray.push(item);
      });
    });
    this.session.set('selectedTerritories', selected);

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
    let selected: TerritoryItem[] = [];
    selectedRegions.forEach(r => {
      selected.push(new TerritoryItem(r));
    });
    this.session.set('selectedRegions', selected);
    Promise.resolve(selectedRegions.length > 0).then((selected) => this.regionsSelected = selected);
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
    this.session.set('disabledYAxisTypes', this.disabledYAxisTypes);
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
