import { TestBed } from '@angular/core/testing';

import { BabywatchService } from './babywatch.service';

describe('BabywatchService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BabywatchService = TestBed.get(BabywatchService);
    expect(service).toBeTruthy();
  });
});
