import {TaskService} from '../../services/task-service/task.service';

import {RouterTestingModule} from '@angular/router/testing';

import {BehaviorSubject} from 'rxjs';

import {fakeAsync, inject, TestBed, tick} from '@angular/core/testing';
import {EditTaskComponent} from './edit-task.component';
import {ShowErrorComponent} from '../../show-error/show-error.component';
import {APPLICATION_VALIDATORS} from '../../models/app-validators';
import {ActivatedRoute, Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MockTaskService} from '../../mocks/mock-task-service';

@Component({
  template: '<router-outlet></router-outlet>'
})
class TestComponent {
}

describe('EditTask Component', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, RouterTestingModule.withRoutes([
        {path: 'new', component: EditTaskComponent},
        {path: 'edit/:id', component: EditTaskComponent}
        ],
      )],
      declarations: [EditTaskComponent, ShowErrorComponent, APPLICATION_VALIDATORS, TestComponent],
      providers: [
        Title,
        {provide: TaskService, useClass: MockTaskService},
        { provide: Location, useClass: SpyLocation }
      ]
    });
  });

  let taskService: TaskService;
  beforeEach(inject([TaskService], (_taskService) => {
    taskService = _taskService;
  }));

  it('should load the correct task in Edit-Mode', fakeAsync(() => {
    const fixture = TestBed.createComponent(EditTaskComponent);
    const route = TestBed.get(ActivatedRoute);
    (<any>route.params).next({id: '42'});

    const element = fixture.nativeElement;

    const spy = spyOn(taskService, 'getTask');
    const fakeTask = {title: 'Task1', assignee: {name: 'John'}};
    spy.and.returnValue(new BehaviorSubject(fakeTask));

    fixture.autoDetectChanges(true);
    fixture.whenStable().then(() => {
      tick();
      expect(spy).toHaveBeenCalledWith('42');
      const titleInput = element.querySelector('#title');
      expect(titleInput.value).toBe(fakeTask.title);

      const assigneeInput = element.querySelector('#assignee_name');
      expect(assigneeInput.value).toBe(fakeTask.assignee.name);
    });
  }));


    it('should load the correct task (with router)', fakeAsync(() => {
        const spy = spyOn(taskService, 'getTask');
        const fakeTask = {title: 'Task1', assignee: {name: 'John'}};
        spy.and.returnValue(new BehaviorSubject(fakeTask));

        const fixture = TestBed.createComponent(TestComponent);
        const router = TestBed.get(Router);

        router.navigateByUrl('edit/42');

        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(spy).toHaveBeenCalledWith('42');
            tick();
            const titleInput = fixture.nativeElement.querySelector('#title');
            expect(titleInput.value).toBe(fakeTask.title);
        });

    }));

  it('should work without passing URL-Parameter', fakeAsync(() => {
    const fixture = TestBed.createComponent(TestComponent);
    const router = TestBed.get(Router);
    router.navigateByUrl('new');
    const spy = spyOn(taskService, 'getTask');
    fixture.whenStable().then(() => {
      tick();
      expect(spy).not.toHaveBeenCalled();
      const titleInput = fixture.nativeElement.querySelector('#title');
      expect(titleInput.value).toBe('');
    });
  }));


});
