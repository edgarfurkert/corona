import {BehaviorSubject} from 'rxjs';
import {Task} from '../models/model-interfaces';

export class MockTaskService {
  tasks$ = new BehaviorSubject<Task[]>([]);

  findTasks(query: string) {
    return new BehaviorSubject<Task[]>([]);
  }

  saveTask(task: Task) {
  }

  deleteTask(task: Task) {
    return new BehaviorSubject<Task>({});
  }

  getTask(id: number | string) {
    return new BehaviorSubject<Task>({});
  }
}
