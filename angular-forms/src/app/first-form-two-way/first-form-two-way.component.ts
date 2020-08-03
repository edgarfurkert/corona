import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ef-first-form-two-way',
  templateUrl: './first-form-two-way.component.html',
  styleUrls: ['./first-form-two-way.component.css']
})
export class FirstFormTwoWayComponent implements OnInit {

  task: any;

  constructor() { 
    this.task = {
      title: 'Neues Entwickler-Team zusammenstellen',
      description: 'Notwendige Kenntnisseee Angular 2 & TypeScript'
    }
  }

  ngOnInit(): void {
  }

  saveTask(value: any) {
    this.task = value;
  }
}
