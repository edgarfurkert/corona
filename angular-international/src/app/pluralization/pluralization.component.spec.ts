import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PluralizationComponent } from './pluralization.component';

describe('PluralizationComponent', () => {
  let component: PluralizationComponent;
  let fixture: ComponentFixture<PluralizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PluralizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PluralizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
