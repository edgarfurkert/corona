import {Injectable, Inject, PLATFORM_ID} from '@angular/core';
import {Observable, BehaviorSubject, fromEvent} from 'rxjs';
import {LOAD, ADD, EDIT, REMOVE, TaskStore} from '../stores/index';
import {SOCKET_IO} from '../../app.tokens';
import {HttpClient, HttpParams} from '@angular/common/http';
import {tap} from 'rxjs/internal/operators';
import {Task} from '../models/model-interfaces';
import {isPlatformBrowser, isPlatformServer} from '@angular/common';
import {makeStateKey, TransferState} from '@angular/platform-browser';

//const BASE_URL = `https://projects-server-dot-project-manager-218411.appspot.com/api/tasks`;
const BASE_URL = `http://localhost:3000/api/tasks/`;

const WEB_SOCKET_URL = 'http://localhost:3001';

const TASKS_KEY = makeStateKey<Task[]>('tasks');

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  socket: SocketIOClient.Socket;

  tasks$: Observable<Task[]>;

  tasksChanged = new BehaviorSubject({});

  constructor(private http: HttpClient, private taskStore: TaskStore,
              @Inject(PLATFORM_ID) private platformId: Object,
              private transferState: TransferState,
              @Inject(SOCKET_IO) socketIO) {
   if (isPlatformBrowser(platformId)) {
      console.log('Ausführung im Browser');
    }
    if (isPlatformServer(platformId)) {
      console.log('Ausführung auf dem Server');
    }

    this.tasks$ = taskStore.items$;
    if (isPlatformBrowser(platformId)) {
        this.socket = socketIO(WEB_SOCKET_URL);
        fromEvent(this.socket, 'task_saved')
            .subscribe((action) => {
                this.taskStore.dispatch(action);
            });
    }
  }

  findTasks(query = '', sort = 'id', order = 'ASC') {
    const searchParams = new HttpParams()
      .append('q', query)
      .append('_sort', sort)
      .append('_order', order);

      if (this.transferState.hasKey(TASKS_KEY) ) {
          const tasks = this.transferState.get(TASKS_KEY, []);
          this.taskStore.dispatch({type: LOAD, data: tasks});
          this.transferState.remove(TASKS_KEY);
      } else {
          this.http.get(BASE_URL, {params: searchParams}).pipe(
              tap(tasks => {
                  if (isPlatformServer(this.platformId)) {
         //             this.transferState.set(TASKS_KEY, tasks);
                  }
              }),
              tap(tasks => this.taskStore.dispatch({type: LOAD, data: tasks}))
          ).subscribe();
      }
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
        const action = {type : actionType, data: savedTask};
        this.taskStore.dispatch(action);
        if (this.socket) {
          this.socket.emit('broadcast_task', action);
        }
      }));
  }
  deleteTask(task: Task) {
    return this.http.delete(BASE_URL + task.id).pipe(
      tap(_ => {
        this.taskStore.dispatch({type: REMOVE, data: task});
      }));
  }
}

