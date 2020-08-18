import {Observable, of, BehaviorSubject} from 'rxjs';
import {Injectable, Inject} from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import {Task} from '../models/model-interfaces';
import { SOCKET_IO } from '../app.tokens';
import { tap } from 'rxjs/operators';
import { EDIT, ADD, TaskStore } from './task.store';

const STORAGE_KEY = 'TASKS';
const BASE_URL = `http://localhost:3000/api/tasks/`;
const WEB_SOCKET_URL = 'http://localhost:3001';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  socket: any;

  tasks: Task[] = [];
  tasks$: Observable<Task[]>;

  tasksChanged = new BehaviorSubject({});

  constructor(private taskStore: TaskStore, private http: HttpClient, @Inject(SOCKET_IO) socketIO) {
    this.loadFromLocalStorage();
    this.tasks$ = this.findTasks();
    this.socket = socketIO(WEB_SOCKET_URL);
    console.log('TaskService: socketIO', socketIO);
    console.log('TaskService: HttpClient', http);
    console.log('TaskService: TaskStore', taskStore);
  }

  findTasks(query = ''): Observable<Task[]> {
    console.log('TaskService: findTasks');
    this.tasks$ = of(this.findTasksIntern(query));
    return this.tasks$;
  }

  getTask(id: number | string): Observable<Task> {
    const task = this.tasks.filter(t => t.id.toString() === id.toString())[0];
    return of((task));
  }

  saveTask(task: Task): Observable<Task> {
    console.log('TaskService: saveTask', task)
    this.tasks = this.tasks.map(_task => {
      return _task.id === task.id ? task : _task;
    });
    this._saveToLocalStorage();

    const method = task.id ? 'PUT' : 'POST';
    return this.http.request(method, BASE_URL + (task.id || ''), {
      body: task
    }).pipe(
      tap(savedTask => {
        this.tasksChanged.next(savedTask);
        const actionType = task.id ? EDIT : ADD;
        const action = { type: actionType, data: savedTask };
        this.taskStore.dispatch(action);
        this.socket.emit('broadcast_task', action);
      }));

    //return of(task);
  }

  private findTasksIntern(query = ''): Task[] {
    console.log('TaskService: findTasksIntern', query);
    if (!query) {
      console.log('TaskService: findTasksIntern', this.tasks);
      return this.tasks;
    }
    console.log('TaskService: findTasksIntern', this.tasks);
    return this.tasks.filter(task => {
      return ((task.title && task.title.indexOf(query) !== -1) ||
        (task.description && task.description.indexOf(query) !== -1) ||
        (task.state && task.state.indexOf(query) !== -1)
      );
    });
  }

  deleteTask(task: Task) {
    this.tasks = this.tasks.filter(_task => _task.id !== task.id);
    this._saveToLocalStorage();
    this.tasks$ = of(this.tasks);
    return this.tasks$;
  }

  private _saveToLocalStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.tasks));
  }

  private loadFromLocalStorage() {
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
