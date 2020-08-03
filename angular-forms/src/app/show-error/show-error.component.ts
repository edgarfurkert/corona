import { Component, OnInit, Input } from '@angular/core';
import { NgForm, FormGroup } from '@angular/forms';

@Component({
  selector: 'ef-show-error',
  templateUrl: './show-error.component.html',
  styleUrls: ['./show-error.component.css']
})
export class ShowErrorComponent implements OnInit {

  @Input('text') displayName = '';
  @Input('path') controlPath;

  constructor(private ngForm: NgForm) { }

  ngOnInit(): void {
  }

  get errorMessages(): string[] {
    const messages = [];
    const form: FormGroup = this.ngForm.form;
    const control = form.get(this.controlPath);
    if (!control) {
      console.log('Control ' + this.controlPath + ' nicht gefunden.');
      return null;
    }
    if (!(control.touched) || !control.errors) {
      return null;
    }

    for (const code in control.errors) {
      if (control.errors.hasOwnProperty(code)) {
        const error = control.errors[code];
        let message = '';
        switch (code) {
          case 'required':
            message = `${this.displayName} ist ein Pflichtfeld`;
            break;
          case 'minlength':
            message = `${this.displayName} muss mindestens ${error.requiredLength} Zeichen enthalten`;
            break;
          case 'maxlength':
            message = `${this.displayName} darf höchstens ${error.requiredLength} Zeichen enthalten`;
            break;
          case 'invalidEMail':
            message = `Bitte geben Sie eine gültige Email-Adresse an`;
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
