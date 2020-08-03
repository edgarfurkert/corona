import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'content-child',
  templateUrl: './content-child.component.html',
  styleUrls: ['./content-child.component.css']
})
export class ContentChildComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    console.log('ContentChild ngOnInit');
  }

  ngAfterViewChecked() {
    console.log('ContentChild ngAfterViewChecked');
  }

  ngAfterContentChecked() {
    console.log('ContentChild ngAfterContentChecked');
  }
}
