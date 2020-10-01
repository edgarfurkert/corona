import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstFormInterfacesComponent } from './first-form-interfaces.component';

describe('FirstFormInterfacesComponent', () => {
  let component: FirstFormInterfacesComponent;
  let fixture: ComponentFixture<FirstFormInterfacesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FirstFormInterfacesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirstFormInterfacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
