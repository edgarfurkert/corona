import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Task } from '../models/model-interfaces';

@Injectable({
  providedIn: 'root'
})
export class MockTaskService {

  tasks$: any = new BehaviorSubject<Task[]>([]);

  constructor() { }

  findTasks(query: string) {
    console.log('MockTaskService.findTasks');
    return new BehaviorSubject([]);
  }

  deleteTask(task: Task) {
    console.log('MockTaskService.deleteTask', task);
    return new BehaviorSubject({});
  }
}
