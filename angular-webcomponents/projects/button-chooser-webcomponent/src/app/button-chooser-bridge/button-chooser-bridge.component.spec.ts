import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonChooserBridgeComponent } from './button-chooser-bridge.component';

describe('ButtonChooserBridgeComponent', () => {
  let component: ButtonChooserBridgeComponent;
  let fixture: ComponentFixture<ButtonChooserBridgeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ButtonChooserBridgeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonChooserBridgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
