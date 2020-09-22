import { Component, OnInit, Inject, LOCALE_ID, ViewChildren, QueryList } from '@angular/core';
import { tap } from 'rxjs/internal/operators';
import { Observable, timer, Subscription } from 'rxjs';

import { MatTableDataSource } from '@angular/material/table';
import { MatExpansionPanel } from '@angular/material/expansion';

import { NgxSpinnerService } from 'ngx-spinner';
import { NGXLogger } from 'ngx-logger';
import { TranslateService } from '@ngx-translate/core';

import { DataInfoService, DataInformation } from '../services/data-info.service';
import { TranslationsService } from '../services/translations.service';
import { SessionService } from '../services/session.service';
import { Territory } from '../models/model.interfaces';
import { DATAINFO_LOG_ENABLED } from '../app.tokens';

class DataInfoTableItem {
  name: string;
  value: string;
}

@Component({
  selector: 'ef-data-info',
  templateUrl: './data-info.component.html',
  styleUrls: ['./data-info.component.scss']
})
export class DataInfoComponent implements OnInit {

  dataSourcesDisplayedColumns: string[] = ['url'];
  dataSourcesDS: MatTableDataSource<any> = new MatTableDataSource<any>([]);

  dataInformationTopDisplayedColumns: string[] = ['name', 'value'];
  dataInformationTopDS: MatTableDataSource<any> = new MatTableDataSource<any>([]);

  dataInformationTerritoriesDisplayedColumns: string[] = ['territoryName', 'parentName', 'minDate', 'maxDate'];
  dataInformationTerritoriesTopDS: MatTableDataSource<Territory> = new MatTableDataSource<Territory>([]);

  dataInformation: DataInformation = new DataInformation();

  dataSourcesLoaded: boolean = false;
  dataInformationLoaded: boolean = false;
  allLoaded$: Observable<number> = timer(0, 100);
  allLoadedSubscription: Subscription;

  translationMap: Map<string, string> = new Map<string, string>();

  @ViewChildren(MatExpansionPanel) panels: QueryList<MatExpansionPanel>;;

  constructor(private spinner: NgxSpinnerService,
    @Inject(LOCALE_ID) private locale: string,
    @Inject(DATAINFO_LOG_ENABLED) private log: boolean,
    private logger: NGXLogger,
    private session: SessionService,
    private dataInfoService: DataInfoService,
    private translationsService: TranslationsService) {

    if (this.log) {
      this.logger.debug('DataInfoComponent: locale', this.locale);
    }

    let loaded = <boolean>this.session.get('dataSourcesLoaded');
    if (loaded) {
      this.dataSourcesLoaded = loaded;
    }
    loaded = <boolean>this.session.get('dataInformationLoaded');
    if (loaded) {
      this.dataInformationLoaded = loaded;
    }

    this.spinner.show();
  }

  ngOnInit(): void {
    this.allLoadedSubscription = this.allLoaded$.subscribe(() => {
      let dataLoaded = this.dataSourcesLoaded && this.dataInformationLoaded;
      if (dataLoaded) {
        this.spinner.hide();
        this.allLoadedSubscription.unsubscribe();
        this.panels.toArray()[1].open();
      }
    });

    if (!this.dataSourcesLoaded) {
      this.dataInfoService.getDataSources().pipe(
        tap(t => {
          if (t.length > 0) {
            if (this.log) {
              this.logger.debug('DataInfoComponent: dataSources', t);
            }
            this.session.set('dataSources', t);
            this.dataSourcesDS = new MatTableDataSource<any>(t);
            this.dataSourcesLoaded = true;
            this.session.set('dataSourcesLoaded', this.dataSourcesLoaded);
          }
        })
      ).subscribe();
    } else {
      let dataSources = <any[]>this.session.get('dataSources');
      this.dataSourcesDS = new MatTableDataSource<any>(dataSources);
    }

    if (this.session.get('translations')) {
      this.translationMap = new Map<string, string>(JSON.parse(this.session.get('translations')));
      this.loadDataInformation();
    } else {
      this.translationsService.getTranslations$().pipe(
        tap(t => {
          if (t == null) {
            if (this.log) {
              this.logger.debug('DataInfoComponent: load translations');
            }
            this.translationsService.getTranslations(this.locale);
          } else {
            this.translationMap = t;
            if (this.log) {
              this.logger.debug('DataInfoComponent: translations');
            }
            this.loadDataInformation();
          }
        })
      ).subscribe();
    }
  }

  ngAfterViewInit() {
  }

  loadDataInformation() {
    if (this.session.get('dataInformationLoaded')) {
      this.dataInformation = <DataInformation>this.session.get('dataInformation');
      this.setDataInformationTopDS(this.dataInformation);
      this.setDataInformationTerritoriesDS(this.dataInformation.territories);
    } else {
      this.dataInfoService.getInformation().pipe(
        tap(di => {
          if (di !== null) {
            if (this.log) {
              this.logger.debug('DataInfoComponent: dataInformation', di);
            }

            di.territories.forEach(t => {
              let name = this.translationMap.get(t.territoryId);
              if (name) {
                t.territoryName = name;
              }
              name = this.translationMap.get(t.parentId);
              if (name) {
                t.parentName = name;
              }
            });
            di.territories.sort((t1, t2) => {
              if (t1.orderId > t2.orderId) {
                return 1;
              }
              if (t1.orderId < t2.orderId) {
                return -1;
              }
              if (t1.parentName > t2.parentName) {
                return 1;
              }
              if (t1.parentName < t2.parentName) {
                return -1;
              }
              if (t1.territoryName > t2.territoryName) {
                return 1;
              }
              if (t1.territoryName < t2.territoryName) {
                return -1;
              }
              return 0;
            });
            this.dataInformation = di;
            this.session.set('dataInformation', this.dataInformation);

            this.setDataInformationTopDS(this.dataInformation);
            this.setDataInformationTerritoriesDS(this.dataInformation.territories);
            this.dataInformationLoaded = true;
            this.session.set('dataInformationLoaded', this.dataInformationLoaded);
          }
        })
      ).subscribe();
    }
  }

  setDataInformationTopDS(di: DataInformation) {
    let topItems: DataInfoTableItem[] = [];
    let item: DataInfoTableItem = new DataInfoTableItem();
    item.name = 'numberOfRecords';
    item.value = di.numberOfRecords.toString();
    topItems.push(item);
    item = new DataInfoTableItem();
    item.name = 'numberOfTerritories';
    item.value = di.numberOfTerritories.toString();
    topItems.push(item);
    if (this.log) {
      this.logger.debug('DataInfoComponent.setDataInformationTopDS: topItems', topItems);
    }
    this.dataInformationTopDS = new MatTableDataSource<DataInfoTableItem>(topItems);
  }

  setDataInformationTerritoriesDS(territories: Territory[]) {
    if (this.log) {
      this.logger.debug('DataInfoComponent.setDataInformationTerritoriesDS: territories', territories);
    }
    this.dataInformationTerritoriesTopDS = new MatTableDataSource<Territory>(territories);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (this.log) {
      this.logger.debug('DataInfoComponent.applyFilter: filterValue', filterValue);
    }
    this.dataInformationTerritoriesTopDS.filter = filterValue.trim().toLowerCase();
  }

}
