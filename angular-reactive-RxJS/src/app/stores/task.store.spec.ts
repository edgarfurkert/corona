import { TestBed } from '@angular/core/testing';

import { TaskStore } from './task.store';

describe('TaskStoreService', () => {
  let service: TaskStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
