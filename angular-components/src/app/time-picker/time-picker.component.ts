import { Component, Input, OnInit, EventEmitter, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.css']
})
export class TimePickerComponent implements OnInit {

  @Input('time') timeString: string;
  @Output('timeChange') changeEvent: EventEmitter<string>;

  time: any;

  maxValues= {
    hours: 23,
    minutes: 59,
    seconds: 59
  };

  constructor() { 
    this.time = {
      hours: 0,
      minutes: 0,
      seconds: 0
    }

    this.changeEvent = new EventEmitter<string>();
  }

  /**
   * ngOnInit-Lifecycle-Callback
   * 
   * Input/Output-Bindings sind vollständig initialisiert.
   */
  ngOnInit() {
    console.log("Init");
    if (this.timeString !== undefined) {
      const timeParts = this.timeString.split(":");
      if (timeParts.length === 3) {
        this.time = {
          hours: parseInt(timeParts[0]),
          minutes: parseInt(timeParts[1]),
          seconds: parseInt(timeParts[2])
        }
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log("Changes: ", changes);
    const timeParts = this.timeString.split(":");
    if (timeParts.length === 3) {
      this.time = {
        hours: parseInt(timeParts[0]),
        minutes: parseInt(timeParts[1]),
        seconds: parseInt(timeParts[2])
      }
    }
  }

  getHours() {
    return this.time.hours;
  }

  getMinutes() {
    return this.time.minutes;
  }

  getSeconds() {
    return this.time.seconds;
  }

  calcColor(value) {
    console.log("calcColor: ", value)
    return value % 2 == 0 ? "green" : "yellow";
  }

  getTime() {
    const hours = this.fillUpZeros(this.time.hours);
    const minutes = this.fillUpZeros(this.time.minutes);
    const seconds = this.fillUpZeros(this.time.seconds);
    return `${hours}:${minutes}:${seconds}`;
  }

  fillUpZeros(value) {
    return `0${value}`.slice(-2);
  }

  emitTimeChange() {
    this.changeEvent.emit(this.getTime());
  }

  incrementTime(field: string) {
    const maxValue = this.maxValues[field];
    this.time[field] = (this.time[field] + 1) % (maxValue + 1);

    this.emitTimeChange();
  }

  decrementTime(field: string) {
    const maxValue = this.maxValues[field];
    this.time[field] = this.time[field] == 0 ? maxValue : this.time[field] - 1;

    this.emitTimeChange();
  }

  changeTime(field: string, inputValue: number) {
    console.log('changeTime: ', field, ' - ', inputValue);
    let value = Math.max(inputValue, 0);
    value = Math.min(value, this.maxValues[field]);
    this.time[field] = value;

    this.emitTimeChange();
  }

  private reset() {
    console.log('reset');
    this.time = {
      hours: 0,
      minutes: 0,
      seconds: 0
    };
    this.emitTimeChange();
  }
}
