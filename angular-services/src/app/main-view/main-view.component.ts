import { Component, OnInit } from '@angular/core';
import { SearchService } from '../services/search-services/search.service';
import { GlobalSearchService } from '../services/search-services/global-search.service';

@Component({
  selector: 'ef-main-view',
  // Sichtbarkeit nur in MainView
  viewProviders: [{ provide: SearchService, useClass: GlobalSearchService }],
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.css']
})
export class MainViewComponent implements OnInit {

  constructor(private searchService: SearchService) { }

  ngOnInit(): void {
  }

}
