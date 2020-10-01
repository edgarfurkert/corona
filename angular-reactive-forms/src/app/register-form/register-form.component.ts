import { Component, OnInit } from '@angular/core';
import { User } from '../models/model-interfaces';

@Component({
  selector: 'ef-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})
export class RegisterFormComponent implements OnInit {

  genderChoices = ['Herr', 'Frau'];
  user: User = {};

  constructor() { 
  }

  ngOnInit(): void {
  }

  register(value: any) {
    console.log(value);
  }
}
