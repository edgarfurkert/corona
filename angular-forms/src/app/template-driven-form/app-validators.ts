import { NG_VALIDATORS, NG_ASYNC_VALIDATORS, AbstractControl } from '@angular/forms';
import { Directive } from '@angular/core';
import { UserService } from '../services/user.service';
import { map } from 'rxjs/operators';

@Directive({
    selector: '[efEmailValidator]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: EmailValidatorDirective, multi: true }
    ]
})
export class EmailValidatorDirective {
    validate(control: AbstractControl): {[key: string]: any} {
        const re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

        if (!control.value || control.value === '' || re.test(control.value)) {
            return null;
        } else {
            return {'invalidEMail': true};
        }
    }
}

@Directive({
    selector: '[efUserExistsValidator]',
    providers: [
        { provide: NG_ASYNC_VALIDATORS, useExisting: UserExistsValidatorDirective, multi: true }
    ]
})
export class UserExistsValidatorDirective {

    constructor(private userService: UserService) {}

    validate(control: AbstractControl): {[key: string]: any} {
        // Observable<boolean>.pipe
        // -> map Observable<boolean> to an validation error structure
        return this.userService.checkUserExists(control.value).pipe(
            map(userExists => {
                return (userExists === false) ? {userNotFound: true} : null;
            })
        )
    }
}

@Directive({
    selector: '[efIfNotBacklogThanAssignee]',
    providers: [{
        provide: NG_VALIDATORS,
        useExisting: IfNotBacklogThanAssigneeValidatorDirective,
        multi: true
    }]
})
export class IfNotBacklogThanAssigneeValidatorDirective {

    validate(formGroup: AbstractControl): {[key: string]: any} {
        const nameControl = formGroup.get('assignee.name');
        const stateControl = formGroup.get('state');

        if (!nameControl || !stateControl) {
            return null;
        }

        if (stateControl.value !== 'BACKLOG' && (!nameControl.value || nameControl.value === '')) {
            return {'assigneeRequired': true};
        }

        return null;
    }
}

export const APPLICATION_VALIDATORS = [
    EmailValidatorDirective,
    UserExistsValidatorDirective,
    IfNotBacklogThanAssigneeValidatorDirective
];
