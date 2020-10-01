import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ef-pluralization',
  templateUrl: './pluralization.component.html',
  styleUrls: ['./pluralization.component.css']
})
export class PluralizationComponent implements OnInit {

  todos: string[] = [
    "Aufräumen",
    "Einkaufen",
    "Mama anrufen",
    "Mit dem Hund Gassi gehen",
    "Joggen"
  ];

  todoTextsMapping = {
    "=0" : "Alle Aufgaben erledigt",
    "=1" : "Eine Aufgabe",
    "other" : "# Aufgaben"
  };

  completeTodo(todo: string) {
    this.todos = this.todos.filter(todo_ =>  todo_ !== todo);
  }
  
  constructor() { }

  ngOnInit(): void {
  }

}
