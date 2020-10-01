import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { TaskService } from '../services/task.service';
import { Task, createInitialTask } from '../models/model-interfaces';
import * as model from '../models/model-interfaces';

@Component({
  selector: 'ef-template-driven-form',
  templateUrl: './template-driven-form.component.html',
  styleUrls: ['./template-driven-form.component.css']
})
export class TemplateDrivenFormComponent implements OnInit {

  model = model;

  task: Task = createInitialTask();

  @ViewChild(NgForm) ngForm: NgForm;

  constructor(private taskService: TaskService) {
  }
  
  ngOnInit(): void {
  }

  addTag() {
    this.task.tags.push({label: ''});
    return false;
  }

  removeTag(i: number) {
    this.task.tags.splice(i, 1);
    return false;
  }

  saveTask(value: any) {
    console.log(value);
    console.log("Task", this.task);
    this.task = this.taskService.saveTask2(this.task);
  }

  cancel() {

  }

}
