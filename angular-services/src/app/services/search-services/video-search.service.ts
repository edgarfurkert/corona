import { Injectable } from '@angular/core';
import { SearchService } from './search.service';

@Injectable({
  providedIn: 'root'
})
export class VideoSearchService implements SearchService {

  constructor() { }

  search(keyword: string): any[] {
    console.log('VideoSearchService: search ', keyword);
    return ['Video-Result 1', 'Video-Result 2'];
  }
}
