import { TestBed, inject } from '@angular/core/testing';

import { AnimationEventsService } from './animation-events.service';

describe('AnimationEventsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AnimationEventsService]
    });
  });

  it('should be created', inject([AnimationEventsService], (service: AnimationEventsService) => {
    expect(service).toBeTruthy();
  }));
});
