import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StartOfGraphComponent } from './start-of-graph.component';

describe('StartOfGraphComponent', () => {
  let component: StartOfGraphComponent;
  let fixture: ComponentFixture<StartOfGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartOfGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartOfGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
