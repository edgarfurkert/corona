import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { TemplateDrivenFormComponent } from './template-driven-form.component';
import { TaskService } from '../services/task.service';
import { UserService } from '../services/user.service';
import { SOCKET_IO } from '../app.tokens';
import { mockIO } from '../mocks/mock-socket';
import { ShowErrorComponent } from '../show-error/show-error.component';
import { APPLICATION_VALIDATORS } from '../models/app-validators';
import { dispatchEvent, setInputValue } from '../helper/test-helper';

describe('TemplateDrivenFormComponent', () => {
  let component: TemplateDrivenFormComponent;
  let fixture: ComponentFixture<TemplateDrivenFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ 
        FormsModule, 
        HttpClientTestingModule 
      ],
      providers: [ 
        TaskService, 
        UserService, 
        { provide: SOCKET_IO, useValue: mockIO } 
      ],
      declarations: [ 
        TemplateDrivenFormComponent,
        ShowErrorComponent,
        APPLICATION_VALIDATORS
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateDrivenFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(true);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // done-Callback: Test von asynchronen Funktionalitäten
  it('should validate the title correctly', (done) => {
    fixture.whenStable().then(() => {
      const form = component.ngForm.form;

      const titleControl = form.get('title');
      console.log('TemplateDrivenForm-Test: titleControl.errors1', titleControl.errors['required'])
      expect(titleControl.errors['required']).toBeTruthy();
      
      titleControl.setValue('Task');
      console.log('TemplateDrivenForm-Test: titleControl.errors2', titleControl.errors['required'])
      expect(titleControl.errors['required']).toBeUndefined();
  
      const expectedError = { requiredLength: 5, actualLength: 4 };
      console.log('TemplateDrivenForm-Test: titleControl.errors3', titleControl.errors['minlength'])
      expect(titleControl.errors['minlength']).toEqual(expectedError);
  
      titleControl.setValue('Task 1');
      console.log('TemplateDrivenForm-Test: titleControl.errors4', titleControl.errors)
      expect(titleControl.errors).toBeNull();

      // Ein Test ist erst erfolgreich beendet, wenn die done-Funktion aufgerufen wurde.
      done();
    });
  });

  it('should validate the email field', (done) => {
    fixture.whenStable().then(() => {
      const element = fixture.nativeElement;
      const emailInput = element.querySelector('#assignee_email');
      expect(emailInput).toBeTruthy();

      emailInput.value = 'foo';
      //emailInput.dispatchEvent(new Event('input'));
      //emailInput.dispatchEvent(new Event('blur'));
      dispatchEvent(emailInput, 'input');
      dispatchEvent(emailInput, 'blur');
      fixture.detectChanges();

      expect(element.querySelector('.alert-danger')).toBeTruthy();
      console.log('alert-danger', element.querySelector('.alert-danger'));
      expect(element.querySelector('.alert-danger').textContent).toContain('Bitte geben Sie eine gültige E-Mail-Adresse an');

      done();
    });
  });

  it('should show no error for valid email addresses', (done) => {
    fixture.whenStable().then(() => {
      const element = fixture.nativeElement;
      const emailInput = element.querySelector('#assignee_email');
      expect(emailInput).toBeTruthy();

      setInputValue(emailInput, 'foo@bar.de');
      expect(element.querySelector('.alert-danger')).toBeNull();

      done();
    });
  });
});
