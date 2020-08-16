import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimePickerComponent } from './time-picker.component';

describe('TimePickerComponent', () => {
  let timePicker: TimePickerComponent;
  let fixture: ComponentFixture<TimePickerComponent>;
  let element: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimePickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimePickerComponent);
    timePicker = fixture.componentInstance;
    fixture.detectChanges();
    element = fixture.nativeElement;
  });

  it('should create', () => {
    expect(timePicker).toBeTruthy();
  });

  it('should change hour-values when clicking buttons', () => {
    (<any>timePicker).timeString = '12:20:23';
    // ngOnChanges-Callback auslösen
    timePicker.ngOnChanges(null);
    // Change-Detection auslösen, um die Daten in den DOM-Baum zu rendern
    fixture.detectChanges();

    let input = element.querySelector('div /deep/ #hours > input');
    expect(input).toBeTruthy();
    expect(input.value).toBe('12');
    input = element.querySelector('div /deep/ #minutes > input');
    expect(input).toBeTruthy();
    expect(input.value).toBe('20');
    input = element.querySelector('div /deep/ #seconds > input');
    expect(input).toBeTruthy();
    expect(input.value).toBe('23');
  });
});
