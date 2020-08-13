import {Task} from '../models/model-interfaces';
import {Observable, of, Subject, Subscription, BehaviorSubject} from 'rxjs';
import {Injectable} from '@angular/core';
const STORAGE_KEY = 'TASKS';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  tasks: Task[] = [];

  taskChanged$ = new Subject<Task>();
  taskChangedSubscription: Subscription;

  constructor() {
    this.loadFromLocalStorage();

    this.taskChangedSubscription = this.taskChanged$.subscribe(changedTask => {
      console.log('TaskService: changed task');
    });
  }

  findTasksAsync(query = ''): Observable<Task[]> {
    console.log('TaskService: findTasksAsync');
    return of(this.findTasks(query));
  }

  getTaskAsync(id: number | string): Observable<Task> {
    const task = this.tasks.filter(t => t.id.toString() === id.toString())[0];
    return of((task));
  }

  saveTaskAsync(task: Task): Observable<Task> {
    console.log('TaskService: saveTaskAsync', task)
    this.tasks = this.tasks.map(_task => {
      return _task.id === task.id ? task : _task;
    });
    this._saveToLocalStorage();
    console.log('TaskService: taskChanged$.next');
    this.taskChanged$.next(task);
    return of(task);
  }

  findTasks(query = ''): Task[] {
    console.log('TaskService: findTasks', query);
    if (!query) {
      console.log('TaskService: findTasks', this.tasks);
      return this.tasks;
    }
    console.log('TaskService: findTasks', this.tasks);
    return this.tasks.filter(task => {
      return ((task.title && task.title.indexOf(query) !== -1) ||
        (task.description && task.description.indexOf(query) !== -1) ||
        (task.state && task.state.indexOf(query) !== -1)
      );
    });
  }

  getTask(id: number | string): Task {
    const task = this.tasks.filter(_task => _task.id.toString() === id.toString())[0];
    return <Task>(Object.assign({}, task));
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
