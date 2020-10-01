import { Component, OnInit, Input, Directive } from '@angular/core';

@Component({
  selector: 'panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit {

  open = true;
  @Input() title: string;

  constructor() { }

  ngOnInit() {
  }

  togglePanel() {
    this.open = !this.open;
  }
}

@Directive({
  selector: 'panel-header'
})
export class PanelHeaderDirective {
  
}