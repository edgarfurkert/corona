import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricalGraphComponent } from './historical-graph.component';

describe('HistoricalGraphComponent', () => {
  let component: HistoricalGraphComponent;
  let fixture: ComponentFixture<HistoricalGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoricalGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricalGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
