import { Component, OnDestroy, ViewChild, ContentChild } from '@angular/core';
import { ViewChildComponent } from '../view-child/view-child.component';
import { ContentChildComponent } from '../content-child/content-child.component';

@Component({
  selector: 'lifecycle-main',
  templateUrl: './lifecycle-main.component.html',
  styleUrls: ['./lifecycle-main.component.css']
})
export class LifecycleMainComponent implements OnDestroy {

  /* Angular 8: Parameter {static: false} */
  @ViewChild(ViewChildComponent, {static: false}) viewChild: ViewChildComponent;
  @ContentChild(ContentChildComponent, {static: false}) contentChild: ContentChildComponent;
  text = 'Hello Lifecycle';
  greeting = {
    text: ''
  }

  constructor() { 
    this.logChildren('constructor');
  }

  textChanged(text: string) {
    this.greeting.text = text;
  }

  logChildren(callback: string) {
    console.log(`---${callback}---`);
    console.log('ViewChild   : ', this.viewChild);
    console.log('ContentChild: ', this.contentChild)
  }

  ngOnInit() {
    console.log('LifecycleMain ngOnInit');
  }

  ngAfterContentInit() {
    this.logChildren('LifecycleMain ngAfterContentInit');
  }

  ngAfterViewInit() {
    this.logChildren('LifecycleMain ngAfterViewInit');
  }

  ngOnDestroy() {
    console.log('LifecycleMain ngOnDestroy');
  }

  ngAfterViewChecked() {
    console.log('LifecycleMain ngAfterViewChecked');
  }

  ngAfterContentChecked() {
    console.log('LifecycleMain ngAfterContentChecked');
  }
}
