import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import {Todo} from '../shared/todo';
@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css']
})
export class TodoItemComponent implements OnInit {

  @Input() todo: Todo;
  @Output() completed = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  complete() {
    this.completed.emit(this.todo);
  }

}
