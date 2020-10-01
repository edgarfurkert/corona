import { Component, OnInit, AfterViewInit, QueryList, ViewChildren, ViewChild } from '@angular/core';
import { TimePickerComponent } from '../time-picker/time-picker.component';

@Component({
  selector: 'calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements AfterViewInit {

  calendarEntry: any;

  @ViewChildren(TimePickerComponent) timePickers: QueryList<TimePickerComponent>;
  timePicker: TimePickerComponent;
  /* Angular 8: Parameter {static: false} */
  @ViewChild(TimePickerComponent, {static: false}) timePicker2: TimePickerComponent;
  @ViewChild('timepicker3', {static: false}) timePicker3: TimePickerComponent;
  
  constructor() { 
    this.calendarEntry = {
      startTime: '23:12:55'
    }
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    console.log('timePickers: length = ', this.timePickers.length);
    console.log('timePickers: ', this.timePickers);
    this.timePicker = this.timePickers.first;
    console.log('Ausgewählte Zeit: first = ' + this.timePicker.getTime());
    console.log('Ausgewählte Zeit: child = ' + this.timePicker2.getTime());
    console.log('Ausgewählte Zeit: timepicker3 = ' + this.timePicker3.getTime());
  }

  onTimeChanged(time: string) {
    console.log("Time changed: ", time);
    this.calendarEntry.startTime = time;
  }
}
