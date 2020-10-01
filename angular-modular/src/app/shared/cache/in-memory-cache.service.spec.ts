import { TestBed } from '@angular/core/testing';

import { InMemoryCacheService } from './in-memory-cache.service';

describe('InMemoryCacheService', () => {
  let service: InMemoryCacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InMemoryCacheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
