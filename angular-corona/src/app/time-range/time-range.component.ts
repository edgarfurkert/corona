import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import { FormGroup, ControlContainer, NgForm } from '@angular/forms';

export class TimeRange {
  startDate: Date;
  endDate: Date;
}

/*
export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD.MM.YYYY',
  },
  display: {
    dateInput: 'DD.MM.YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  },
};
*/

@Component({
  selector: 'ef-time-range',
  templateUrl: './time-range.component.html',
  styleUrls: ['./time-range.component.scss'],
  /*
  providers: [
    // The locale would typically be provided on the root module of your application. We do it at
    // the component level here, due to limitations of our example generation script.
    { provide: MAT_DATE_LOCALE, useValue: 'de-DE' },

    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ],
  */
  viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
})
export class TimeRangeComponent implements OnInit {

  @Input() start: Date;
  @Input() startTitle: string;
  @Input() end: Date;
  @Input() endTitle: string;
  @Input() min: Date;
  @Input() max: Date;
  @Input() title: string;
  private _log: boolean = false;
  @Input()
  set log(value: string) {
    this._log = value === 'true';
  }
  get log(): string {
    return this._log.toString();
  }
  @Output() timeRangeChange = new EventEmitter();

  timeRange: TimeRange = new TimeRange();
  minDate: Date;
  maxDate: Date = new Date();

  constructor() { }

  ngOnInit(): void {
    this.timeRange.startDate = new Date(this.start);
    this.timeRange.endDate = new Date(this.end);
    this.minDate = this.min;
    this.maxDate = this.max;
    if (this._log) {
      console.log('TimeRangeComponent.ngOnInit: timeRange', this.timeRange, 'minDate', this.minDate, 'maxDate', this.maxDate);
    }
  }

  startDateChange(event) {
    // Return date object 
    this.timeRange.startDate = new Date(event.value);
    if (this._log) {
      console.log('TimeRangeComponent.startDateChange: timeRange', this.timeRange);
    }
    this.timeRangeChange.emit(this.timeRange);
  }

  endDateChange(event) {
    // Return date object
    this.timeRange.endDate = new Date(event.value);
    if (this._log) {
      console.log('TimeRangeComponent.startDateChange: timeRange', this.timeRange);
    }
    this.timeRangeChange.emit(this.timeRange);
  }
}
