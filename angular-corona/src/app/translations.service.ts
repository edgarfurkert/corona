import { Injectable } from '@angular/core';

export interface Translation {
  key: string;
  text: string;
}


@Injectable({
  providedIn: 'root'
})
export class TranslationsService {

  constructor() { }
}
