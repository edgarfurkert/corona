import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstFormOneWayComponent } from './first-form-one-way.component';

describe('FirstFormOneWayComponent', () => {
  let component: FirstFormOneWayComponent;
  let fixture: ComponentFixture<FirstFormOneWayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FirstFormOneWayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirstFormOneWayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
