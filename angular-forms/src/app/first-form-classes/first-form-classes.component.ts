import { Component, OnInit } from '@angular/core';
import { Task } from './model-classes';

@Component({
  selector: 'ef-first-form-classes',
  templateUrl: './first-form-classes.component.html',
  styleUrls: ['./first-form-classes.component.css']
})
export class FirstFormClassesComponent implements OnInit {

  task: Task;

  constructor() { 
    this.task = new Task();
  }

  ngOnInit(): void {
  }

  saveTask(value: any) {
    this.task = new Task(value);
    console.log(this.task);
  }
}
