import { TestBed } from '@angular/core/testing';

import { ButtonChooserService } from './button-chooser.service';

describe('ButtonChooserService', () => {
  let service: ButtonChooserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ButtonChooserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
