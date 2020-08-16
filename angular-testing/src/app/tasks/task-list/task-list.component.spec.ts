import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, of } from 'rxjs';

import { TaskListComponent } from './task-list.component';
import { TaskItemComponent } from '../task-item/task-item.component';
import { TaskService } from 'src/app/services/task.service';
import { MockTaskService } from 'src/app/services/mock-task.service';

fdescribe('TaskListComponent', () => {
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
});
