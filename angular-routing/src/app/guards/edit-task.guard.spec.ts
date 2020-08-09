import { TestBed } from '@angular/core/testing';

import { EditTaskGuard } from './edit-task.guard';

describe('EditTaskGuard', () => {
  let guard: EditTaskGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(EditTaskGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
