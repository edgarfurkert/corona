import { Injectable } from '@angular/core';
import { SearchService } from './search.service';

@Injectable()
export class GlobalSearchService implements SearchService {

  constructor() { }

  search(keyword: string): any[] {
    return ['Global result 1', 'Global result 2'];
  }
}
