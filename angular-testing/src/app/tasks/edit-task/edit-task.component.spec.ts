import { async, ComponentFixture, TestBed, fakeAsync, inject, tick } from '@angular/core/testing';

import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Title } from '@angular/platform-browser';

import { EditTaskComponent } from './edit-task.component';
import { TaskService } from 'src/app/services/task.service';
import { MockTaskService } from 'src/app/services/mock-task.service';
import { Task } from 'src/app/models/model-interfaces';
import { ShowErrorComponent } from 'src/app/show-error/show-error.component';

describe('EditTaskComponent', () => {
  let component: EditTaskComponent;
  let fixture: ComponentFixture<EditTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, RouterTestingModule.withRoutes([]) ],
      declarations: [ EditTaskComponent, ShowErrorComponent ],
      providers: [
        {provide: TaskService, useClass: MockTaskService}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  let taskService: TaskService;
  beforeEach(inject([TaskService], /*callback function with injected parameter*/(_taskService) => {
    taskService = _taskService;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load the correct task in Edit-Mode', fakeAsync(() => {
    const route = TestBed.get(ActivatedRoute);

    const element = fixture.nativeElement;

    const fakeTask: Task = {title: 'Task1', assignee: {name: 'John'}};
    const spy = spyOn(taskService, 'getTaskAsync').and.returnValue(new BehaviorSubject(fakeTask));
    
    fixture.autoDetectChanges(true);

    console.log('EditTask-Test: route');
    (<any>route.params).next({id: '42'});

    // Simuliert den asynchronen Zeitablauf für die Zeitgeber in der FakeAsync-Zone.
    console.log('EditTask-Test: tick');
    tick();

    expect(spy).toHaveBeenCalledWith('42');
      
    fixture.whenStable().then(() => {
      const titleInput = element.querySelector('#title');
      console.log('EditTask-Test: title', titleInput.value);
      expect(titleInput.value).toBe(fakeTask.title);

      const assigneeInput = element.querySelector('#assignee_name');
      console.log('EditTask-Test: assignee', assigneeInput.value);
      expect(assigneeInput.value).toBe(fakeTask.assignee.name);
    });
  }));
});
