import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';

export interface RBChoice {
  id: string;
  title: string;
  disabled?: boolean;
};

@Component({
  selector: 'ef-radio-button-group',
  templateUrl: './radio-button-group.component.html',
  styleUrls: ['./radio-button-group.component.scss']
})
export class RadioButtonGroupComponent implements OnInit, OnChanges {

  @Input() choices: RBChoice[] = [];
  @Input() selected: string;
  @Input() disabled: string[] = [];
  @Input() title: string;
  @Input() name: string;
  @Input() log: boolean = false;
  @Output() onSelect = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.log) {
      console.log('RadioButtonGroupComponent.ngOnChanges: changes', changes);
    }
    this.choices.forEach(c => {
      c.disabled = this.disabled.includes(c.id);
      if (this.log) {
        console.log('RadioButtonGroupComponent.ngOnInit: disabled choice', c);
      }
    });
  }

  select(ev: MatRadioChange) {
    if (this.log) {
      console.log('RadioButtonGroupComponent.select', ev);
    }
    this.onSelect.emit(ev.value);
  }
}
