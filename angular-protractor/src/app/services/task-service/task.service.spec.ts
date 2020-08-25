import {TestBed, inject, fakeAsync} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TaskService} from './task.service';
import {TaskStore} from '../stores/task.store';
import {SOCKET_IO} from '../../app.tokens';
import {mockIO} from '../../mocks/mock-socket';
import {HttpClient} from '@angular/common/http';


describe('Task-Service', () => {
  let taskService: TaskService;
  let taskStore: TaskStore;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TaskService,
        TaskStore,
        {provide: SOCKET_IO, useValue: mockIO},
      ]
    });
    taskService = TestBed.get(TaskService);
    taskStore = TestBed.get(TaskStore);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  const saveTask = (task, expectedUrl = null, expectedMethod = null) => {
    taskService.saveTask(task).subscribe();
    const request = httpTestingController.expectOne({
        url: expectedUrl,
        method: expectedMethod
      });

      request.flush(task);
  };

  it('should trigger a HTTP-POST for new Tasks', (() => {
    const task = {title: 'Task 1'};
    taskService.saveTask(task).subscribe();

    const request = httpTestingController.expectOne({
      url: 'http://localhost:3000/api/tasks/',
      method: 'POST'
    });


  }));

  it('should trigger a HTTP-POST for new Tasks', (() => {
    const task = {title: 'Task 1'};
    saveTask(task, 'http://localhost:3000/api/tasks/', 'POST');
  }));

  it('should do a HTTP-Put for existing Tasks', (() => {
    const task = {id: 1, title: 'Existing Task'};
    saveTask(task, 'http://localhost:3000/api/tasks/1', 'PUT');
  }));

  it('should add the Task to the store', (() => {
    const spy = spyOn(taskStore, 'dispatch').and.callThrough();
    saveTask({title: 'Task 1'});
    const dispatchedAction = spy.calls.mostRecent().args[0];
    expect(dispatchedAction.type).toEqual('ADD');
    expect(dispatchedAction.data.title).toEqual('Task 1');
  }));

  it('should save the Task in store', (() => {
    const spy = spyOn(taskStore, 'dispatch').and.callThrough();
    saveTask({id: 1, title: 'Task 1'});
    const dispatchedAction = spy.calls.mostRecent().args[0];
    expect(dispatchedAction.type).toEqual('EDIT');
    expect(dispatchedAction.data.title).toEqual('Task 1');
  }));

});
