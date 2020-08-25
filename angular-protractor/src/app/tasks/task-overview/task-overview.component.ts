import {Component} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Task} from '../../models/model-interfaces';
import {TaskService} from "../../services/task-service/task.service";
import * as model from "../../models/model-interfaces";

@Component({
  templateUrl: './task-overview.component.html',
  styleUrls: ['./task-overview.component.css'],
})
export class TaskOverviewComponent {

  id: string;

  model = model;

  showSuccessLabel = false;

  task: Task;

  constructor(private route: ActivatedRoute,
              private taskService: TaskService) {
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
        this.taskService.getTask(params['id']).subscribe(task => {
          this.task = task;
        });
    });
  }

  saveTask() {
    this.taskService.saveTask(this.task)
      .subscribe(task => {
        this.task = task;
        this.showSuccessLabel = true;
        setTimeout(() => {
          this.showSuccessLabel = false;
        }, 2000)
      });
  }
}
