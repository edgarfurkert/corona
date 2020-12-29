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
  private _log: boolean = false;
  @Input()
  set log(value: string) {
    this._log = value === 'true';
  }
  get log(): string {
    return this._log.toString();
  }
  @Output() onSelect = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  select(ev: MatSelectChange) {
    if (this._log) {
      console.log('SelectionBoxComponent.select', ev);
    }
    this.onSelect.emit(ev.value);
  }
}
