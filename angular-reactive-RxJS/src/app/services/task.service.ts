import {Task} from '../models/model-interfaces';
import {Observable, of} from 'rxjs';
import {Injectable} from '@angular/core';
const STORAGE_KEY = 'TASKS';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  tasks: Task[] = [];

  constructor() {
    this.loadFromLocalStorage();
  }

  findTasks(query = ''): Task[] {
    if (!query) {
      return this.tasks;
    }
    return this.tasks.filter(task => {
      return ((task.title && task.title.indexOf(query) !== -1) ||
        (task.description && task.description.indexOf(query) !== -1) ||
        (task.state && task.state.indexOf(query) !== -1)
      );
    });
  }

  findTasksAsync(query = ''): Observable<Task[]> {
    return of(this.findTasks(query));
  }


  getTask(id: number | string): Task {
    const task = this.tasks.filter(_task => _task.id.toString() === id.toString())[0];
    return <Task>(Object.assign({}, task));
  }

  getTaskAsync(id: number | string): Observable<Task> {
    const task = this.tasks.filter(t => t.id.toString() === id.toString())[0];
    return of((task));
  }

  saveTask(task: Task) {
    if (task.id) {
      this.tasks = this.tasks.map(_task => {
        return _task.id === task.id ? task : _task;
      });
    } else {
      task.id = new Date().getTime(); // Pseudo Id
      this.tasks = [...this.tasks, task];
    }
    this._saveToLocalStorage();
    return task;
  }

  deleteTask(task: Task) {
    this.tasks = this.tasks.filter(_task => _task.id !== task.id);
    this._saveToLocalStorage();
  }

  _saveToLocalStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.tasks));
  }

  loadFromLocalStorage() {
    const tasksString = localStorage.getItem(STORAGE_KEY);
    if (tasksString) {
      this.tasks = <Task[]>JSON.parse(tasksString);
    } else {
      this.tasks = [
        {
          id: 1,
          title: 'Neues Entwickler-Team zusammenstellen ',
          description: 'Das ist wirklich sehr dringend. Bitte so schnell wie möglich darum kümmern...',
          state: 'IN_PROGRESS',
          assignee: {
            name: 'John Doe',
            email: 'john@doe.com'
          }
        }, {
          id: 2,
          title: 'Ersten Prototyp mit Angular entwickeln',
          description: 'Der Prototyp soll zeigen, wie Routing und HTTP-Anbindung umgesetzt werden können.',
          state: 'BACKLOG',
          assignee: {
            name: 'John Doe',
            email: 'john@doe.com'
          }
        }];
    }
  }
}
