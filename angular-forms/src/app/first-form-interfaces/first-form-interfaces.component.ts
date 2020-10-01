import { Component, OnInit } from '@angular/core';
import { Task } from './model-interfaces';
import { createInitialTask } from './model-interfaces';

@Component({
  selector: 'ef-first-form-interfaces',
  templateUrl: './first-form-interfaces.component.html',
  styleUrls: ['./first-form-interfaces.component.css']
})
export class FirstFormInterfacesComponent implements OnInit {

  task: Task;

  constructor() { 
    this.task = createInitialTask();
  }

  ngOnInit(): void {
  }

  saveTask(value: any) {
    this.task = value;
    console.log(this.task);
  }
}
