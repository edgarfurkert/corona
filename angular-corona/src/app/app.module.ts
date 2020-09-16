import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';

import * as Highcharts from 'highcharts';
import more from 'highcharts/highcharts-more';
more(Highcharts);

import { HighchartsChartModule } from 'highcharts-angular';
import { StorageServiceModule } from 'ngx-webstorage-service';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { NgxSpinnerModule } from 'ngx-spinner';

import { CONSOLE_LOG_ENABLED, ANALYSIS_LOG_ENABLED, SERVICE_LOG_ENABLED } from './app.tokens';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AnalysisComponent } from './analysis/analysis.component';
import { DataInfoComponent } from './data-info/data-info.component';
import { CheckboxListComponent } from './checkbox-list/checkbox-list.component';
import { TimeRangeComponent } from './time-range/time-range.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectionBoxComponent } from './selection-box/selection-box.component';
import { RadioButtonGroupComponent } from './radio-button-group/radio-button-group.component';
import { HistoricalGraphComponent } from './historical-graph/historical-graph.component';
import { HistoricalBubblesGraphComponent } from './historical-bubbles-graph/historical-bubbles-graph.component';
import { HistoricalStackedAreasGraphComponent } from './historical-stacked-areas-graph/historical-stacked-areas-graph.component';
import { InfectionsAndGraphComponent } from './infections-and-graph/infections-and-graph.component';
import { Top25GraphComponent } from './top25-graph/top25-graph.component';
import { StartOfGraphComponent } from './start-of-graph/start-of-graph.component';

const locale = (<any>document).locale;

@NgModule({
  declarations: [
    AppComponent,
    AnalysisComponent,
    DataInfoComponent,
    CheckboxListComponent,
    TimeRangeComponent,
    SelectionBoxComponent,
    RadioButtonGroupComponent,
    HistoricalGraphComponent,
    HistoricalBubblesGraphComponent,
    HistoricalStackedAreasGraphComponent,
    InfectionsAndGraphComponent,
    Top25GraphComponent,
    StartOfGraphComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    LoggerModule.forRoot({serverLoggingUrl: '/api/logs', level: NgxLoggerLevel.DEBUG, serverLogLevel: NgxLoggerLevel.ERROR}),
    NgxSpinnerModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatBottomSheetModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatExpansionModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTableModule,
    MatSortModule,
    MatCheckboxModule,
    MatGridListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    HighchartsChartModule,
    StorageServiceModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    MatDatepickerModule,
    { provide: CONSOLE_LOG_ENABLED, useValue: true },
    { provide: ANALYSIS_LOG_ENABLED, useValue: true },
    { provide: SERVICE_LOG_ENABLED, useValue: true },
    { provide: LOCALE_ID, useValue: locale} 
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
