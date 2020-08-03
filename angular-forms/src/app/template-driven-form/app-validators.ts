import { NG_VALIDATORS, AbstractControl } from '@angular/forms';
import { Directive } from '@angular/core';

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

export const APPLICATION_VALIDATORS = [EmailValidatorDirective];
