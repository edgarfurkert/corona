import {Directive, forwardRef} from '@angular/core';
import {
  FormGroup,
  AbstractControl,
  NG_VALIDATORS,
  NG_ASYNC_VALIDATORS,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from '../services/user.service';

export function ifNotBacklogThenAssignee(controlGroup: FormGroup): {[key: string]: boolean} {
  const assigneeName = controlGroup.get('assignee.name');
  const state = controlGroup.get('state');
  if (!assigneeName || !state) {
    return;
  }
  if ((state.value && state.value !== 'BACKLOG') &&
      (!assigneeName.value || assigneeName.value === '')) {
    return {'assigneeRequired': true};
  }
  return null;
}

export function asyncIfNotBacklogThenAssignee(control): Promise<any> {
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(ifNotBacklogThenAssignee(control));
    }, 500);
  });
  return promise;
}

@Directive({
  selector: '[ifNotBacklogThenAssignee]',
  providers: [
    {provide: NG_VALIDATORS,
     useExisting: IfNotBacklogThenAssigneeValidatorDirective, multi: true}]
})
export class IfNotBacklogThenAssigneeValidatorDirective {

  validate(formGroup: FormGroup): {[key: string]: any} {
    const nameControl = formGroup.get('assignee.name');
    const stateControl = formGroup.get('state');
    if (!nameControl || !stateControl ||
        stateControl.value === 'BACKLOG') {
      return null;
    }
    if (!nameControl.value || nameControl.value === '') {
      return {'assigneeRequired': true};
    }
    return null;
  }
}

@Directive({
  selector: '[emailValidator]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: EmailValidatorDirective, multi: true
  }]
})
export class EmailValidatorDirective {
  validate(control: AbstractControl): {[key: string]: any} {
    const re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    if (!control.value || control.value === '' || re.test(control.value)) {
      return null;
    } else {
      console.log('EmailValidatorDirective: invalidEMail');
      return {'invalidEMail': true};
    }
  }
}

export function emailValidator(control): {[key: string]: any} {
  const re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
  if (!control.value || control.value === '' || re.test(control.value)) {
    return null;
  } else {
    return {'invalidEMail': true};
  }
}

@Directive({
  selector: '[userExistsValidator]',
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: forwardRef(() => UserExistsValidatorDirective), multi: true
    }
  ]
})
export class UserExistsValidatorDirective {
  constructor(private userService: UserService) {
  }

  validate(control: AbstractControl): Observable<any> {
    console.log('Validating User');
    return this.userService.checkUserExists(control.value).pipe(
      map(userExists => !userExists ? {userNotFound: true} : null));
  }
}


export const APPLICATION_VALIDATORS = [IfNotBacklogThenAssigneeValidatorDirective, EmailValidatorDirective];
