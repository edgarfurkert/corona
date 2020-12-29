import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Top25GraphComponent } from './top25-graph.component';

describe('Top25GraphComponent', () => {
  let component: Top25GraphComponent;
  let fixture: ComponentFixture<Top25GraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Top25GraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Top25GraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
