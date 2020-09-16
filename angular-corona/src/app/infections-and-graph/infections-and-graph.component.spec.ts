import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfectionsAndGraphComponent } from './infections-and-graph.component';

describe('InfectionsAndGraphComponent', () => {
  let component: InfectionsAndGraphComponent;
  let fixture: ComponentFixture<InfectionsAndGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfectionsAndGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfectionsAndGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
