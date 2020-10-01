import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricalStackedAreasComponent } from './historical-stacked-areas.component';

describe('HistoricalStackedAreasComponent', () => {
  let component: HistoricalStackedAreasComponent;
  let fixture: ComponentFixture<HistoricalStackedAreasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoricalStackedAreasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricalStackedAreasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
