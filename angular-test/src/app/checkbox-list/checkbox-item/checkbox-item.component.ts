import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { CheckboxItem, createInitialItem } from '../models/model-interfaces';

@Component({
  selector: 'ef-checkbox-item',
  templateUrl: './checkbox-item.component.html',
  styleUrls: ['./checkbox-item.component.css']
})
export class CheckboxItemComponent implements OnInit {

  @Input() id: string;
  @Input() label: string;
  @Output() change = new EventEmitter();

  constructor() { 

  }

  ngOnInit(): void {
  }
}
