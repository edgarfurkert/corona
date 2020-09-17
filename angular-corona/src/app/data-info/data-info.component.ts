import { Component, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { tap } from 'rxjs/internal/operators';
import { Observable, timer, Subscription } from 'rxjs';

import { MatTableDataSource } from '@angular/material/table';

import { NgxSpinnerService } from 'ngx-spinner';
import { NGXLogger } from 'ngx-logger';

import { DataInfoService, DataInformation } from '../services/data-info.service';
import { TranslationsService } from '../services/translations.service';

@Component({
  selector: 'ef-data-info',
  templateUrl: './data-info.component.html',
  styleUrls: ['./data-info.component.scss']
})
export class DataInfoComponent implements OnInit {

  textLoadingData: string = 'Loading Data';

  dataSourcesColumnHeader = 'URL';

  dataSourcesDisplayedColumns: string[] = ['url'];
  dataSourcesDS: MatTableDataSource<any> = new MatTableDataSource<any>([]);

  dataInformation: DataInformation = new DataInformation();

  dataSourcesLoaded: boolean = false;
  dataInformationLoaded: boolean = false;
  allLoaded$: Observable<number> = timer(0, 100);
  allLoadedSubscription: Subscription;

  translationMap: Map<string, string> = new Map<string, string>();

  constructor(private spinner: NgxSpinnerService,
    @Inject(LOCALE_ID) private locale: string,
    private logger: NGXLogger,
    private dataInfoService: DataInfoService,
    private translationsService: TranslationsService) {
    this.spinner.show();
  }

  ngOnInit(): void {
    this.allLoadedSubscription = this.allLoaded$.subscribe(() => {
      let dataLoaded = this.dataSourcesLoaded && this.dataInformationLoaded;
      if (dataLoaded) {
        this.spinner.hide();
        this.allLoadedSubscription.unsubscribe();
      }
    });

    this.dataInfoService.getDataSources().pipe(
      tap(t => {
        if (t.length > 0) {
          this.dataSourcesDS = new MatTableDataSource<any>(t);
          this.dataSourcesLoaded = true;
        }
      })
    ).subscribe();

    this.translationsService.getTranslations$().pipe(
      tap(t => {
        if (t == null) {
          this.translationsService.getTranslations(this.locale);
        } else {
          this.translationMap = t;
          console.log('DataInfoComponent: translations');
          this.dataInfoService.getInformation().pipe(
            tap(c => {
              if (c !== null) {
                c.territories.forEach(t => {
                  let name = this.translationMap.get(t.territoryId);
                  if (name) {
                    t.territoryName = name;
                  }
                  name = this.translationMap.get(t.parentId);
                  if (name) {
                    t.parentName = name;
                  }
                });
                this.dataInformation = c;
                this.dataInformationLoaded = true;
              }
            })
          ).subscribe();
        }
      })
    ).subscribe();
  }
}
