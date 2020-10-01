import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, fromEvent } from 'rxjs';
import { tap } from 'rxjs/operators';

import { LOAD, ADD, EDIT, REMOVE, TaskStore } from '../stores/index';
import { SOCKET_IO } from '../../app.tokens';
import { Task } from '../../shared/models/model-interfaces';

const BASE_URL = `http://localhost:3000/api/tasks/`;

const WEB_SOCKET_URL = 'http://localhost:3001';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  socket: any;

  tasks$: Observable<Task[]>;
  tasksChanged = new BehaviorSubject({});
  
  constructor(private http: HttpClient, private taskStore: TaskStore,
    @Inject(SOCKET_IO) socketIO) {

    this.tasks$ = taskStore.items$;
    this.socket = socketIO(WEB_SOCKET_URL);
    fromEvent(this.socket, 'task_saved')
      .subscribe((action) => {
        this.taskStore.dispatch(action);
      });
  }

  findTasks(query = '', sort = 'id', order = 'ASC') {
    console.log('TaskService.findTasks');
    const searchParams = new HttpParams()
      .append('q', query)
      .append('_sort', sort)
      .append('_order', order);

    this.http.get(BASE_URL, { params: searchParams }).pipe(
      tap((tasks) => {
        this.taskStore.dispatch({ type: LOAD, data: tasks });
      })).subscribe();

    return this.tasks$;
  }

  getTask(id: number | string): Observable<Task> {
    return this.http.get<Task>(BASE_URL + id);
  }


  saveTask(task: Task) {
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
  }
  deleteTask(task: Task) {
    return this.http.delete(BASE_URL + task.id).pipe(
      tap(_ => {
        this.taskStore.dispatch({ type: REMOVE, data: task });
      }));
  }
}

