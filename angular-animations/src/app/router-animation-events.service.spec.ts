import { TestBed, inject } from '@angular/core/testing';

import { RouterAnimationEventsService } from './router-animation-events.service';

describe('RouterAnimationEventsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RouterAnimationEventsService]
    });
  });

  it('should be created', inject([RouterAnimationEventsService], (service: RouterAnimationEventsService) => {
    expect(service).toBeTruthy();
  }));
});
