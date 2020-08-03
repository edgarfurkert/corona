import { Component, OnInit } from '@angular/core';
import {Task, createInitialTask} from './model-interfaces';
import * as model from './model-interfaces';

@Component({
  selector: 'ef-template-driven-form',
  templateUrl: './template-driven-form.component.html',
  styleUrls: ['./template-driven-form.component.css']
})
export class TemplateDrivenFormComponent implements OnInit {

  model = model;

  task: Task = createInitialTask();

  constructor() { 
  }

  ngOnInit(): void {
  }

  saveTask(value: any) {
    this.task = value;
    console.log(this.task);
  }
}
