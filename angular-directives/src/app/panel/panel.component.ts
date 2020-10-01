import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'ef-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit {

  open = true;
  @Input() title: string;
  @Output() panelToggled = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  togglePanel() {
    this.open = !this.open;
    this.panelToggled.emit(this);
  }

}
