import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratedFormComponent } from './generated-form.component';

describe('GeneratedFormComponent', () => {
  let component: GeneratedFormComponent;
  let fixture: ComponentFixture<GeneratedFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneratedFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneratedFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
