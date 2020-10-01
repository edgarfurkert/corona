import { Component, OnInit, Input, Optional } from '@angular/core';
import { NgForm, FormGroup, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'ef-show-error',
  templateUrl: './show-error.component.html',
  styleUrls: ['./show-error.component.css']
})
export class ShowErrorComponent implements OnInit {

  @Input('path') path;
  @Input('text') displayName = '';

  constructor(@Optional() private ngForm: NgForm,
              @Optional() private formGroup: FormGroupDirective) { }

  ngOnInit(): void {
  }

  get errorMessages(): string[] {
    let form: FormGroup;
    if (this.ngForm) {
      //console.log('NgForm is used');
      form = this.ngForm.form;
    } else {
      //console.log('FormGroupDirective is used');
      form = this.formGroup.form;
    }

    const control = form.get(this.path);
    //console.log('Control ' + this.path + ': ' + control);
    const messages = [];

    if (!control || !(control.touched) || !control.errors) {
      return null;
    }

    console.log('errors: ' + control.errors);
    for (const code in control.errors) {
      if (control.errors.hasOwnProperty(code)) {
        const error = control.errors[code];
        console.log('errorMessages: ' + code);
        let message = '';
        switch (code) {
          case 'required':
            message = `${this.displayName} ist ein Pflichtfeld`;
            break;
          case 'minlength':
            message = `${this.displayName} muss mindestens ${error.requiredLength} Zeichen enthalten`;
            break;
          case 'maxlength':
            message = `${this.displayName} darf maximal ${error.requiredLength} Zeichen enthalten`;
            break;
          case 'invalidEMail':
            message = `Bitte geben Sie eine gültige E-Mail-Adresse an`;
            break;
          case 'userNotFound':
            message = `Der eingetragene Benutzer existiert nicht.`;
            break;
          default:
            message = `${name} ist nicht valide`;
        }
        messages.push(message);
      }
    }

    return messages;
  }
}
