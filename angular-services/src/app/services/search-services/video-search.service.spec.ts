import { TestBed } from '@angular/core/testing';

import { VideoSearchService } from './video-search.service';

describe('VideoSearchService', () => {
  let service: VideoSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VideoSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
