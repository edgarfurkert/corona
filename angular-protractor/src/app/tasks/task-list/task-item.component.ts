import {Component, EventEmitter, ChangeDetectionStrategy} from '@angular/core';
import {Router} from '@angular/router';
import {Task} from '../../models/model-interfaces';

@Component({
  selector: 'pjm-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ['task', 'selected'],
  outputs: ['taskSelected' , 'taskDelete'],
})
export class TaskItemComponent {

  selected: boolean;
  task: Task;

  checkCounter = 0;

  taskSelected  = new EventEmitter();
  taskDelete = new EventEmitter();

  constructor(private router: Router) {

  }
  select() {
    this.taskSelected.emit(this.task.id)
  }

  delete() {
    this.taskDelete.emit(this.task);
  }

  ngAfterViewChecked() {
    //var taskId = (this.task ? this.task.id : '');
   // console.log(`Task ${taskId} checked ${++this.checkCounter} times`)
  }
}

