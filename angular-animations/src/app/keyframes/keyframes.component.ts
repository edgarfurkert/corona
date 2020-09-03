import { Component, OnInit, HostBinding } from '@angular/core';
import { style, animate, transition, keyframes, trigger} from '@angular/animations';

import {Todo} from '../shared/todo';

@Component({
  selector: 'keyframes',
  templateUrl: './keyframes.component.html',
  styleUrls: ['./keyframes.component.css'],
  animations: [
    trigger('todoAnimation', [
      transition(':enter', [
        // Definition von mehrstufigen Animationen
        animate('1400ms', keyframes([
          style({opacity: 0, transform: 'translateY(-100%)', offset: 0}),
          style({opacity: 0.5, transform: 'translateY(15px)',  offset: 0.3}),
          style({opacity: 1, transform: 'translateY(0)',     offset: 1.0})
        ]))
      ]),
      transition(':leave', [
        //style({'transform-origin': '100% 100%'}),
        animate('1400ms', keyframes([
          style({opacity: 1, transform: 'translateX(-15px)',  offset: 0.3}),
          style({opacity: 0, transform: 'translateX(100%)',     offset: 1.0})
        ]))
      ])
    ])]
})
export class KeyframesComponent implements OnInit {

  todos: Todo[] = [];

  constructor() {

  }

  addTodo(text: string) {
    console.log('Keyframes: addTodo', text);
    this.todos = [...this.todos, {text: text, completed: false}];
  }

  completeTodo(todo: Todo) {
    console.log('Keyframes: completeTodo', todo);
    this.todos = this.todos.filter(todo_ =>  todo_ !== todo);
  }

  ngOnInit() {
  }

}
