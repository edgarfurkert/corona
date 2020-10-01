import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export abstract class SearchService {

  constructor() { }

  abstract search(keyword: string): any[];
  
}
