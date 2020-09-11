import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Graphic2Component } from './graphic2.component';

describe('Graphic2Component', () => {
  let component: Graphic2Component;
  let fixture: ComponentFixture<Graphic2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Graphic2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Graphic2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
