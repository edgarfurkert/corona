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
    if (!control || !(control.touched) || !control.errors) {
      console.log('Control ' + this.controlPath + ' nicht gefunden.');
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
            message = `Der Wert von ${this.displayName} muss mindestens ${error.requiredLength} Zeichen enthalten`;
            break;
          case 'maxlength':
            message = `Der Wert von ${this.displayName} darf höchstens ${error.requiredLength} Zeichen enthalten`;
            break;
          case 'invalidEMail':
            message = `Bitte geben Sie eine gültige Email-Adresse an`;
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
