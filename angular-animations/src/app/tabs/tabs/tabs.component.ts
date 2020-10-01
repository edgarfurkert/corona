import { Component, OnInit, ContentChildren, QueryList } from '@angular/core';
import { TabComponent } from '../tab/tab.component';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css'],
  animations: [
    trigger('tabState', [
      state('active', style({'opacity': '1', 'transform': 'scaleX(1)'})),
      state('inactive', style({'opacity': '0', 'transform': 'scaleX(0)'})),
      // ease-in/out: Timing functions, startet langsam und wird zum Ende hin schneller
      //transition('active => inactive', [animate('350ms ease-out')]),
      //transition('inactive => active', [animate('350ms ease-in')])
      transition('inactive <=> active', [animate('350ms ease')])
    ])
  ]
})
export class TabsComponent implements OnInit {

  @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;

  constructor() { }

  ngOnInit() {
  }

  ngAfterContentInit() {
    this.tabs.first.active = true;
  }

  activate(tab: TabComponent) {
    this.tabs.forEach(tab => {
      tab.active = false;
    });
    tab.active = true;
  }

  animationStarted(ev: AnimationEvent) {
    console.log('Animation started: ', ev);
  }

  animationDone(ev: AnimationEvent) {
    console.log('Animation done: ', ev);
  }
}
