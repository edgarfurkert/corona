import { Component, OnInit, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'ef-button-chooser',
  templateUrl: './button-chooser.component.html',
  styleUrls: ['./button-chooser.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ButtonChooserComponent,
      multi: true
    }
  ]
})
export class ButtonChooserComponent implements ControlValueAccessor {

  @Input() choices: string[];
  value: any;

  private propagateChange = Function.prototype;
  private propagateTouched = Function.prototype;

  constructor() { }

  writeValue(obj: any): void {
    this.value = obj;
  }
  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.propagateTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    throw new Error("Method not implemented.");
  }

  changeValue(value: any) {
    this.value = value;
    this.propagateChange(this.value);
    this.propagateTouched();
    return false;
  }
}
