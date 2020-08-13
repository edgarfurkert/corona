import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/model-interfaces';
import * as model from '../../models/model-interfaces';

@Component({
  selector: 'ef-task-overview',
  templateUrl: './task-overview.component.html',
  styleUrls: ['./task-overview.component.css']
})
export class TaskOverviewComponent implements OnInit {

  model = model;

  task: Task;
  showSuccessLabel: boolean = false;

  constructor(private route: ActivatedRoute, private taskService: TaskService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.task = this.taskService.getTask(params['id']);
    })
  }

  saveTask() {
    this.taskService.saveTaskAsync(this.task).subscribe(task => {
      this.task = task;
      this.showSuccessLabel = true;
      console.log('showSuccessLabel: ', this.showSuccessLabel)
      setTimeout(() => {
        this.showSuccessLabel = false;
        console.log('showSuccessLabel: ', this.showSuccessLabel)
      }, 3000);
    });
  }
}
