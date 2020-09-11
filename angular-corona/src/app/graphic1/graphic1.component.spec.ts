import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Graphic1Component } from './graphic1.component';

describe('Graphic1Component', () => {
  let component: Graphic1Component;
  let fixture: ComponentFixture<Graphic1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Graphic1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Graphic1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
