import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';

export class TimeRange {
  startDate: Date;
  endDate: Date;
}

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

@Component({
  selector: 'ef-time-range',
  templateUrl: './time-range.component.html',
  styleUrls: ['./time-range.component.scss'],
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
  ]
})
export class TimeRangeComponent implements OnInit {

  @Input() start: Date;
  @Input() end: Date;
  @Input() min: Date;
  @Input() max: Date;
  @Input() title: string;

  @Output() timeRangeChange = new EventEmitter();

  timeRange: TimeRange = new TimeRange();
  minDate: Date;
  maxDate: Date = new Date();

  constructor() { }

  ngOnInit(): void {
    this.timeRange.startDate = this.start;
    this.timeRange.endDate = this.end;
    this.minDate = this.min;
    this.maxDate = this.max;
    console.log('TimeRangeComponent.ngOnInit: timeRange', this.timeRange);
  }

  startDateChange(event) {
    // Return date object 
    this.timeRange.startDate = event.value;
    console.log('TimeRangeComponent.startDateChange: timeRange', this.timeRange);
    this.timeRangeChange.emit(this.timeRange);
  }

  endDateChange(event) {
    // Return date object
    this.timeRange.endDate = event.value;
    console.log('TimeRangeComponent.startDateChange: timeRange', this.timeRange);
    this.timeRangeChange.emit(this.timeRange);
  }
}
