import {Observable, of} from 'rxjs';
import {Injectable} from '@angular/core';
import { HttpClient, HttpParams, HttpResponse, HttpHeaders } from '@angular/common/http';

import {Task} from '../models/model-interfaces';
import { map } from 'rxjs/internal/operators';

const STORAGE_KEY = 'TASKS';

const BASE_URL = 'http://localhost:3000/api/tasks/';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  tasks: Task[] = [];

  constructor(private http: HttpClient) {
    this.loadFromLocalStorage();
  }

  findTasks(query = ''): Task[] {
    console.log('TaskService: findTasks');
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

  findTasksByHttp(query: string = '',
            sort: string = 'id',
            order: string = 'ASC'): Observable<Task[]> {
    console.log('TaskService: findTasksByHttp');
    const searchParams = new HttpParams().append('q', query)
                                         .append('_sort', sort)
                                         .append('_order', order);
    return this.http.get<Task[]>(BASE_URL, { params: searchParams });
  }

  /*
  // Klassisches Callback-Pattern mit jQuery
  loadAllTasks(callback) {
    $.get('http://localhost:3000/api/tasks', (data) => {
      if (callback && typeof callback === "function") {
        callback(data);
      }
    })
  }
  */
  loadAllTasks(): Observable<Task[]> {
    console.log('TaskService: loadAllTasks');
    return this.http.get<Task[]>(BASE_URL);
  }

  loadTasksWithFullResponse(): Observable<HttpResponse<Task[]>> {
    const params = new HttpParams().append('_limit', '1');
    return this.http.get<Task[]>(BASE_URL, { observe: 'response', params: params });
  }

  findTasksAsync(query = ''): Observable<Task[]> {
    console.log('TaskService: findTasksAsync');
    return of(this.findTasks(query));
  }

  createTaskByHttp(task: Task): Observable<Task> {
    console.log('TaskService: createTask');
    return this.http.post<Task>(BASE_URL, task);
  }

  createTaskLongByHttp(task: Task): Observable<Task> {
    console.log('TaskService: createTaskLong');
    const headers = new HttpHeaders().append('Content-Type', 'application/json');
    return this.http.post<Task>(BASE_URL, JSON.stringify(task), { headers: headers });
  }

  updateTaskByHttp(task: Task): Observable<Task> {
    console.log('TaskService: updateTask');
    return this.http.put<Task>(BASE_URL + task.id, task);
  }

  deleteTaskByHttp(task: Task): Observable<HttpResponse<any>> {
    console.log('TaskService: deleteTaskByHttp');
    return this.http.delete<Task>(BASE_URL + task.id, { observe: 'response' });
  }

  saveTaskByHttp(task: Task) {
    console.log('TaskService: saveTaskByHttp');
    const method = task.id ? 'PUT' : 'POST';
    return this.http.request<Task>(method, BASE_URL + (task.id || ''), { body: task });
  }

  updateStateByHttp(id: number, state: string): Observable<Task> {
    console.log('TaskService: updateStateByHttp');
    const body = { state: state };
    return this.http.patch<Task>(BASE_URL + id, body);
  }

  checkTasksByHttp(): Observable<HttpHeaders> {
    console.log('TaskService: checkTasksByHttp');
    return this.http.head(BASE_URL, { observe: 'response', responseType: 'text' }).pipe(map(response => response.headers));
  }

  getTask(id: number | string): Task {
    console.log('TaskService: getTask - ', id);
    const task = this.tasks.filter(_task => _task.id.toString() === id.toString())[0];
    return <Task>(Object.assign({}, task));
  }

  getTaskByHttp(id: number | string): Observable<Task> {
    console.log('TaskService: getTaskByHttp - ', id);
    return this.http.get<Task>(BASE_URL + id);
  }

  getTaskAsync(id: number | string): Observable<Task> {
    console.log('TaskService: getTaskAsync - ', id);
    const task = this.tasks.filter(t => t.id.toString() === id.toString())[0];
    return of((task));
  }

  saveTask(task: Task) {
    console.log('TaskService: saveTask - ', task);
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
    console.log('TaskService: deleteTask - ', task);
    this.tasks = this.tasks.filter(_task => _task.id !== task.id);
    this._saveToLocalStorage();
  }

  _saveToLocalStorage() {
    console.log('TaskService: _saveToLocalStorage');
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.tasks));
  }

  loadFromLocalStorage() {
    console.log('TaskService: loadFromLocalStorage');
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
