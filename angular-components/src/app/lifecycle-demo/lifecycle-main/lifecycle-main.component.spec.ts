import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LifecycleMainComponent } from './lifecycle-main.component';

describe('LifecycleMainComponent', () => {
  let component: LifecycleMainComponent;
  let fixture: ComponentFixture<LifecycleMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LifecycleMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LifecycleMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
