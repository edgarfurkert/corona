import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricalBubblesGraphComponent } from './historical-bubbles-graph.component';

describe('HistoricalBubblesComponent', () => {
  let component: HistoricalBubblesGraphComponent;
  let fixture: ComponentFixture<HistoricalBubblesGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoricalBubblesGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricalBubblesGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
