import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Task } from 'src/app/models/model-interfaces';

@Component({
  selector: 'ef-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskItemComponent implements OnInit {

  @Input() task: Task;
  @Input() selected: boolean;

  @Output() taskSelected: EventEmitter<number>;
  @Output() taskDelete: EventEmitter<Task>;

  constructor() { 
    this.taskSelected = new EventEmitter<number>();
    this.taskDelete = new EventEmitter<Task>();
  }

  ngOnInit(): void {
  }

  select() {
    console.log('TaskItem - select: ', this.task.id);
    this.taskSelected.emit(this.task.id);
  }

  delete() {
    console.log('TaskItem - delete: ', this.task.id);
    this.taskDelete.emit(this.task);
  }
}
