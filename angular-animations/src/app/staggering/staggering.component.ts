import { Component } from '@angular/core';
import {style, animate, transition, query, stagger, trigger, keyframes} from '@angular/animations';

import {Todo} from '../shared/todo';

@Component({
  selector: 'staggering',
  templateUrl: './staggering.component.html',
  styleUrls: ['./staggering.component.css'],
  animations: [
    trigger('listAnimation', [
      // sämtliche Statusübergänge selektieren
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0 }),
          // Animation zeitverzögert (150ms) auf alle Elemente der Liste anwenden
          stagger(150, [
            animate(1400, keyframes([
              style({opacity: 0, transform: 'translateY(-100%)', offset: 0}),
              style({opacity: 0.5, transform: 'translateY(15px)',  offset: 0.3}),
              style({opacity: 1, transform: 'translateY(0)',     offset: 1.0})
            ]))          ])
        ], {optional: true}),
         query(':leave', [
          stagger(1150, [
            animate(1400, keyframes([
              style({opacity: 1, transform: 'translateX(-15px)',  offset: 0.3}),
              style({opacity: 0, transform: 'translateX(100%)',     offset: 1.0})
            ]))          ])
        ], {optional: true})
      ])
    ])
  ]
})
export class StaggeringComponent {

  initial: Todo[] = [{
    text: 'Aufräumen',
    completed: false
  }, {
    text: 'Einkaufen',
    completed: false
  }, {
    text: 'Angular lernen',
    completed: false
  }, {
    text: 'Joggen',
    completed: false
  }];

  todos: Todo[] = [];

  clearTodos() {
    this.todos = [];
  }

  addTodo(text: string) {
    this.todos = [...this.todos, {text: text, completed: false}];
  }

  completeTodo(todo: Todo) {
    this.todos = this.todos.filter(todo_ =>  todo_ !== todo);
  }

  loadTodos() {
    this.todos = this.initial;
  }
}
