import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ef-translation-techniques',
  templateUrl: './translation-techniques.component.html',
  styleUrls: ['./translation-techniques.component.css']
})
export class TranslationTechniquesComponent implements OnInit {

  user: string = 'Edgar';

  constructor() { }

  ngOnInit(): void {
  }

}
