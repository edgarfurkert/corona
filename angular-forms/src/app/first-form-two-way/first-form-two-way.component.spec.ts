import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstFormTwoWayComponent } from './first-form-two-way.component';

describe('FirstFormTwoWayComponent', () => {
  let component: FirstFormTwoWayComponent;
  let fixture: ComponentFixture<FirstFormTwoWayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FirstFormTwoWayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirstFormTwoWayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
