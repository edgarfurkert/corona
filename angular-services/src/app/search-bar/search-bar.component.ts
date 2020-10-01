import { Component, OnInit, Input } from '@angular/core';
import { SearchService } from '../services/search-services/search.service'

@Component({
  selector: 'ef-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {

  @Input('title') title: string;

  results: any[];

  constructor(private searchService: SearchService) { }

  ngOnInit(): void {
  }

  search(value: string) {
    console.log('Search: ', value);
    this.results = this.searchService.search(value);
    console.log('Results: ', this.results);
  }
}
