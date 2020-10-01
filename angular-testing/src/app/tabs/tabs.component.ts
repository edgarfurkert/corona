import {Component, ContentChildren, Input, AfterContentInit} from '@angular/core';
import { TestComponent } from './test/test.component';

@Component({
  selector: 'ch-tab',
  template: `<div *ngIf='active' class='tab-content'>
                 <ng-content></ng-content>
             </div>`
})
export class TabComponent {
  @Input() title;
  active: boolean;
  constructor() {
    this.active = false;
  }
}

@Component({
  selector: 'ch-tabs',
  styleUrls: ['./tabs.component.css'],
  template: `
  <div class='tabs'>
    <ul>
      <li *ngFor='let tab of tabs' [class.active]='tab.active' (click)='activate(tab)'>
        <a>{{tab.title}}</a>
      </li>
    </ul>
    <ng-content></ng-content>
  </div>
  `
})
export class TabsComponent implements AfterContentInit {

  @ContentChildren(TabComponent) tabs;

  ngAfterContentInit() {
    this.tabs.first.active = true;
  }

  activate(tab) {
    for (const tab_ of this.tabs.toArray()) {
      tab_.active = false;
    }
    tab.active = true;
  }
}

export const TABS_DIRECTIVES = [TabsComponent, TabComponent, TestComponent];
