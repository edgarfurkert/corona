import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'ef-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-material';

  constructor(@Inject(DOCUMENT) private document: Document) {}

  toggleTheme() {
    this.document.body.classList.toggle("dark-theme");
  }
}
