import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassSelectorCliComponent } from './class-selector-cli.component';

describe('ClassSelectorCliComponent', () => {
  let component: ClassSelectorCliComponent;
  let fixture: ComponentFixture<ClassSelectorCliComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassSelectorCliComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassSelectorCliComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
