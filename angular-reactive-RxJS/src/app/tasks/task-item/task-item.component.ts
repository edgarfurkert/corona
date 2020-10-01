import {Component, EventEmitter, ChangeDetectionStrategy} from '@angular/core';
import {Task} from '../../models/model-interfaces';

@Component({
  selector: 'task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ['task', 'selected'],
  outputs: ['taskSelected' , 'taskDelete'],
})
export class TaskItemComponent {
  selected: boolean;
  task: Task;

  taskSelected  = new EventEmitter();
  taskDelete = new EventEmitter();

  select() {
    this.taskSelected.emit(this.task.id);
  }

  delete() {
    this.taskDelete.emit(this.task);
  }
}

