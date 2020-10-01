import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, of } from 'rxjs';

import { TaskListComponent } from './task-list.component';
import { TaskItemComponent } from '../task-item/task-item.component';
import { TaskService } from 'src/app/services/task.service';
import { MockTaskService } from 'src/app/services/mock-task.service';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let element: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule.withRoutes([])],
      declarations: [TaskListComponent, TaskItemComponent],
      providers: [
        {provide: TaskService, useClass: MockTaskService},
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    element = fixture.nativeElement;
  });

  let taskService: TaskService;
  beforeEach(inject([TaskService], /*callback function with injected parameter*/(_taskService) => {
    taskService = _taskService;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display TaskItems in the List', () => {
    console.log('TaskList-Test');
    (<BehaviorSubject<any>>taskService.tasks$).next([
      { id: 1, title: 'Task1', description: 'Hello Karma'},
      { id: 2, title: 'Task2', description: 'Hello Jasmine'}
    ]);
    fixture.detectChanges(); // trigger change detection
    expect(element.querySelectorAll('.task-list-entry').length).toBe(2);
    expect(element.querySelector('.task-list-entry').textContent).toContain('Hello Karma');
  });

  it('should display TaskItems in the List (with TestBed.get)', () => {
    const taskService = TestBed.get(TaskService);

    (<BehaviorSubject<any>>taskService.tasks$).next([
      { id: 1, title: 'Task1', description: 'Hello Karma'},
      { id: 2, title: 'Task2', description: 'Hello Jasmine'}
    ]);

    fixture.detectChanges(); // trigger change detection
    expect(element.querySelectorAll('.task-list-entry').length).toBe(2);
    expect(element.querySelector('.task-list-entry').textContent).toContain('Hello Karma');
  });

  it ('should call deleteTask when clicking the trash-bin', () => {
    // Task-Liste füllen
    const task = { id: 42, title: 'Task 1' };
    (<BehaviorSubject<any>>taskService.tasks$).next([task]);
    fixture.detectChanges(); // trigger change detection

    // Spy-Objekt für deleteTask-Methode erzeugen
    const spy = spyOn(taskService, 'deleteTask');
    // 1. Rückgabe-Wert definieren
    //spy.and.returnValue(new BehaviorSubject<any>({}));
    // 2. Methode wie programmiert aufrufen
    spy.and.callThrough();

    // Task löschen
    const trash = element.querySelector('.glyphicon-trash');
    expect(trash).toBeTruthy();
    trash.click();

    // Spy auswerten
    const deleteArguments = spy.calls.mostRecent().args;
    console.log('deleteArguments: ', deleteArguments);
    expect(deleteArguments[0]).toBe(task);
    expect(taskService.deleteTask).toHaveBeenCalledWith(task);
  });
});
