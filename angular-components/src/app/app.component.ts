import {Component} from '@angular/core';

/**
 * Tag-Selector
 * 
 * Usage: 
 * <app-hello>Die Applikation wird geladen...</app-hello>
 */
@Component({
  selector: 'app-hello',
  templateUrl: './app.component.html',
})
export class AppComponent {
  name: string;
  constructor() {
    this.name = 'Angular';
  }
}

