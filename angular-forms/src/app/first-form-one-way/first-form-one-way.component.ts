import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ef-first-form-one-way',
  templateUrl: './first-form-one-way.component.html',
  styleUrls: ['./first-form-one-way.component.css']
})
export class FirstFormOneWayComponent implements OnInit {

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
