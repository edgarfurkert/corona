import { Component, OnInit } from '@angular/core';
import { SearchService } from '../services/search-services/search.service';
import { VideoSearchService } from '../services/search-services/video-search.service';

@Component({
  selector: 'ef-video-library',
  providers: [ { provide: SearchService, useClass: VideoSearchService }],
  templateUrl: './video-library.component.html',
  styleUrls: ['./video-library.component.css']
})
export class VideoLibraryComponent implements OnInit {

  results: any[];

  constructor(private searchService: SearchService) { }

  ngOnInit(): void {
  }
}
