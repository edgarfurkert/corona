import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';

export interface SBChoice {
  id: string;
  title: string;
}

@Component({
  selector: 'ef-selection-box',
  templateUrl: './selection-box.component.html',
  styleUrls: ['./selection-box.component.scss']
})
export class SelectionBoxComponent implements OnInit {

  @Input() choices: SBChoice[] = [];
  @Input() selected: string;
  @Input() title: string;
  @Output() onSelect = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  select(ev: MatSelectChange) {
    console.log('SelectionBoxComponent.select', ev);
    this.onSelect.emit(ev.value);
  }
}
