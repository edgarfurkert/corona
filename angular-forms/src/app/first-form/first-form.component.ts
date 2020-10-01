import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ef-first-form',
  templateUrl: './first-form.component.html',
  styleUrls: ['./first-form.component.css']
})
export class FirstFormComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  saveTask(value: any) {
    console.log(value);
  }
}
