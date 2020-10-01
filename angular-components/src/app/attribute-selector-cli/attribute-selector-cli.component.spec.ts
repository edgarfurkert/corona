import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributeSelectorCliComponent } from './attribute-selector-cli.component';

describe('AttributeSelectorCliComponent', () => {
  let component: AttributeSelectorCliComponent;
  let fixture: ComponentFixture<AttributeSelectorCliComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttributeSelectorCliComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttributeSelectorCliComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
