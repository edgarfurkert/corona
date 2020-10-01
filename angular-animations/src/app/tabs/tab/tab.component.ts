import { Component, OnInit, Input } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.css'],
  animations: [
    trigger('tabActive', [
      // translateX: horizontale Verschiebung im x%
      state('active', style({transform: 'translateX(0%)'})),
      // void: You can use the void state to configure transitions for an element that is entering or leaving a page.
      // *   : The wildcard state * matches to any state, including void.
      state('void', style({transform: 'translateX(100%)'})),
      // A transition of '* => void' applies when the element leaves a view, regardless of what state it was in before it left.
      // Der Tab-Inhalt, der ausgeblendet wird, wird nach rechts aus dem Bild verschoben (+100%)
      //transition('* => void', [animate('3500ms ease-out')]),
      transition(':leave', [animate('3500ms ease-out')]),
      // A transition of 'void => *' applies when the element enters a view, regardless of what state it assumes when entering.
      // Der neue Tab-Inhalt wird von links in das Bild verschoben (-100% -> 0%)
      //transition('void => *', [
      transition(':enter', [
        style({transform: 'translateX(-100%)'}), 
        animate('3500ms ease-in')
      ])
    ])
  ]
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
