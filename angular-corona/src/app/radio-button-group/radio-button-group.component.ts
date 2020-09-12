import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';

export interface RBChoice {
  id: string;
  title: string;
};

@Component({
  selector: 'ef-radio-button-group',
  templateUrl: './radio-button-group.component.html',
  styleUrls: ['./radio-button-group.component.scss']
})
export class RadioButtonGroupComponent implements OnInit {

  @Input() choices: RBChoice[] = [];
  @Input() selected: string;
  @Input() title: string;
  @Input() name: string;
  @Input() log: boolean = false;
  @Output() onSelect = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  select(ev: MatRadioChange) {
    if (this.log) {
      console.log('RadioButtonGroupComponent.select', ev);
    }
    this.onSelect.emit(ev.value);
  }
}
