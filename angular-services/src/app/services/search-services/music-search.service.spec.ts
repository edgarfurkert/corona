import { TestBed } from '@angular/core/testing';

import { MusicSearchService } from './music-search.service';

describe('MusicSearchService', () => {
  let service: MusicSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MusicSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
