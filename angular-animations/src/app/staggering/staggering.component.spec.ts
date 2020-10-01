import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StaggeringComponent } from './staggering.component';

describe('StaggeringComponent', () => {
  let component: StaggeringComponent;
  let fixture: ComponentFixture<StaggeringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StaggeringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaggeringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
