import { Component, OnInit } from '@angular/core';
import {animate, group, query, style, transition, trigger, sequence} from '@angular/animations';

@Component({
  selector: 'querying',
  templateUrl: './querying.component.html',
  styleUrls: ['./querying.component.css'],
  animations: [
    trigger('panelAnimation', [
      transition(':enter', [
        query('.panel-heading', style({transform: 'translateX(-100%)'})),
        query('.panel-body', style({ opacity: 0 })),
        query('.panel-footer',
            style({transform: 'translateY(100%)'}),
            {optional: true} // optionaler Footer
        ),
        group([
        //sequence([
          query('.panel-heading', animate(400, style({transform: 'translateX(0%)'}))),
          query('.panel-body', animate(1400, style({ opacity: 1 }))),
          query('.panel-footer', animate(1400, style({transform: 'translateY(0)'}))),
        ])
      ])
    ])
  ]
})
export class QueryingComponent implements OnInit {

  showDialog = false;

  constructor() { }

  ngOnInit() {
  }


}
