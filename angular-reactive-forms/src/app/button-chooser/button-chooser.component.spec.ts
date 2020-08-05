import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonChooserComponent } from './button-chooser.component';

describe('ButtonChooserComponent', () => {
  let component: ButtonChooserComponent;
  let fixture: ComponentFixture<ButtonChooserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ButtonChooserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonChooserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
