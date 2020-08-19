import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactiveFormComponent } from './reactive-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TaskService } from '../services/task.service';
import { UserService } from '../services/user.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SOCKET_IO } from '../app.tokens';
import { mockIO } from '../mocks/mock-socket';

describe('ReactiveFormComponent', () => {
  let component: ReactiveFormComponent;
  let fixture: ComponentFixture<ReactiveFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ 
        ReactiveFormsModule, 
        HttpClientTestingModule 
      ],
      providers: [ 
        TaskService, 
        UserService, 
        { provide: SOCKET_IO, useValue: mockIO } 
      ],
      declarations: [ ReactiveFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReactiveFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate the title correctly', () => {
    const form = component.taskForm;

    const titleControl = form.get('title');
    console.log('ReactiveForm-Test: titleControl.errors1', titleControl.errors['required'])
    expect(titleControl.errors['required']).toBeTruthy();
    
    titleControl.setValue('Task');
    console.log('ReactiveForm-Test: titleControl.errors2', titleControl.errors['required'])
    expect(titleControl.errors['required']).toBeUndefined();

    const expectedError = { requiredLength: 5, actualLength: 4 };
    console.log('ReactiveForm-Test: titleControl.errors3', titleControl.errors['minlength'])
    expect(titleControl.errors['minlength']).toEqual(expectedError);

    titleControl.setValue('Task 1');
    console.log('ReactiveForm-Test: titleControl.errors4', titleControl.errors)
    expect(titleControl.errors).toBeNull();
  });
});
