import { Component, OnInit, HostBinding } from '@angular/core';
import { zoomInOut, growShrinkFade } from './grouping.animations';
import { growAndShrink } from './sequencing.animations';

@Component({
  selector: 'grouping',
  templateUrl: './grouping.component.html',
  styleUrls: ['./grouping.component.css'],
  animations: [
    zoomInOut('box1Animation'),
    growAndShrink('box2Animation'),
    growShrinkFade('box3Animation')
  ]
})
export class GroupingComponent implements OnInit {

  showBox1: boolean;
  showBox2: boolean;
  showBox3: boolean;

  constructor() { }

  ngOnInit() {
  }

}
