import { Component } from '@angular/core';

@Component({
  selector: 'ef-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-directives';
  borderWidth = 0;
  sliderValue = 0;

  submit(value: string) {
    console.log("submit: " + value);
  }
}
