import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.css']
})
export class TabComponent implements OnInit {

  @Input() title: string;
  active: boolean;

  constructor() { 
    this.active = false;
  }

  ngOnInit() {
  }

}
