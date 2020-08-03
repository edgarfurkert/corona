import { Injectable } from '@angular/core';
import { SearchService } from './search.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MusicSearchService implements SearchService {

  constructor(http: HttpClient) { }

  search(value: string): any[] {
    console.log('MusicSearchService: search ', value);
    return ['Music-Result 1', 'Music-Result 2'];
  }
}
