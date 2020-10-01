import { Injectable } from '@angular/core';
import { Task } from '../models/model-interfaces';
import { BehaviorSubject } from 'rxjs';

export const LOAD = 'LOAD';
export const ADD = 'ADD';
export const EDIT = 'EDIT';
export const REMOVE = 'REMOVE';

@Injectable({
  providedIn: 'root'
})
export class TaskStore {
  // Immutable data store
  private tasks: Task[] = [];
  items$ = new BehaviorSubject<Task[]>([]);

  constructor() { }

  dispatch(action) {
    this.tasks = this.reduce(this.tasks, action);
    this.items$.next(this.tasks);
  }

  /**
   * Reducer Function
   * 
   * Data changes create always a new instance of data (immutable)
   * 
   * @param tasks Task[]
   * @param action {type: LOAD|ADD|EDIT|REMOVE, data: Task(s)}
   */
  reduce(tasks: Task[], action) {
    switch (action.type) {
      case LOAD:
        return [...action.data];
      case ADD:
        return [...tasks, action.data];
      case EDIT:
        return tasks.map(task => {
          const editedTask = action.data;
          if (task.id !== editedTask.id) {
            return task;
          }
          return editedTask;
        });
      case REMOVE:
        return tasks.filter(task => task.id !== action.data.id);
      default:
        return tasks;
    }
  }
}
