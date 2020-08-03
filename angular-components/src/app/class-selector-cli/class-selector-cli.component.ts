import { Component, OnInit } from '@angular/core';

@Component({
  selector: '.classSelector',
  templateUrl: './class-selector-cli.component.html',
  styleUrls: ['./class-selector-cli.component.css']
})
export class ClassSelectorCliComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

@Component({
  selector: 'span.spanClassSelector',
  templateUrl: './span-class-selector-cli.component.html',
  styleUrls: ['./class-selector-cli.component.css']
})
export class SpanClassSelectorCliComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

@Component({
  selector: 'h1:not(.goodbye)',
  templateUrl: './not-class-selector-cli.component.html',
  styleUrls: ['./class-selector-cli.component.css']
})
export class NotClassSelectorCliComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
