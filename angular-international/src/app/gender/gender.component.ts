import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ef-gender',
  templateUrl: './gender.component.html',
  styleUrls: ['./gender.component.css']
})
export class GenderComponent implements OnInit {

  registrationMessages = {
    'male': 'Sehr geehrter Herr',
    'female': 'Sehr geehrte Frau'
  }

  user = {
    gender: "female",
    firstName: "Jane",
    lastName: "Doe"
  };

  constructor() { }

  ngOnInit(): void {
  }

}
