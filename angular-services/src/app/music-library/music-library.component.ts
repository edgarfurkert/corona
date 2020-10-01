import { Component, OnInit } from '@angular/core';
import { SearchService } from '../services/search-services/search.service';
import { MusicSearchService } from '../services/search-services/music-search.service';

@Component({
  selector: 'ef-music-library',
  providers: [ { provide: SearchService, useClass: MusicSearchService }],
  templateUrl: './music-library.component.html',
  styleUrls: ['./music-library.component.css']
})
export class MusicLibraryComponent implements OnInit {

  results: any[];

  constructor(private searchService: SearchService) { }

  ngOnInit(): void {
  }
}
