import { TestBed } from '@angular/core/testing';

import { OAuthLoginService } from './oauth-login.service';

describe('OAuthLoginService', () => {
  let service: OAuthLoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OAuthLoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
