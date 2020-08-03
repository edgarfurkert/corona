import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstFormClassesComponent } from './first-form-classes.component';

describe('FirstFormClassesComponent', () => {
  let component: FirstFormClassesComponent;
  let fixture: ComponentFixture<FirstFormClassesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FirstFormClassesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirstFormClassesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
