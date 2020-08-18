import { TestBed } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';

import { TaskService } from './task.service';
import { SOCKET_IO } from '../app.tokens';
import { mockIO } from '../mocks/mock-socket';
import { TaskStore } from './task.store';

fdescribe('TaskService', () => {
  let service: TaskService;
  let taskStore: TaskStore;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        TaskService,
        TaskStore,
        { provide: SOCKET_IO, useValue: mockIO }
      ]
    });
    service = TestBed.inject(TaskService);
    taskStore = TestBed.get(TaskStore);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should trigger a HTTP-POST for new Tasks', () => {
    const task = { title: 'Task 1' };
    service.saveTask(task).subscribe();

    const request = httpTestingController.expectOne({
      url: 'http://localhost:3000/api/tasks/',
      method: 'POST'
    });
  });

  const saveTask = (task, expectedUrl = null, expectedMethod = null) => {
    service.saveTask(task).subscribe();

    const request = httpTestingController.expectOne({
      url: expectedUrl,
      method: expectedMethod
    });

    // Simulation der HttpClient-Antwort
    request.flush(task);
  };

  it('should trigger a HTTP-POST for new Tasks', () => {
    const task = { title: 'Task 1' };
    saveTask(task, 'http://localhost:3000/api/tasks/', 'POST');
  });

  it('should do a HTTP-PUT for existing Tasks', () => {
    const task = { id: 1, title: 'Existing Task 1' };
    saveTask(task, 'http://localhost:3000/api/tasks/1', 'PUT');
  });

  it('should add the Task to the store', () => {
    // realer Aufruf der dispatch-Methode überwachen
    const spy = spyOn(taskStore, 'dispatch').and.callThrough();
    saveTask({ title: 'Task 1' });

    // Übergabe-Daten prüfen
    const dispatchedAction = spy.calls.mostRecent().args[0];
    console.log('dispatchedAction', dispatchedAction);
    expect(dispatchedAction.type).toEqual('ADD');
    expect(dispatchedAction.data.title).toEqual('Task 1');
  });
});
