import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslationTechniquesComponent } from './translation-techniques.component';

describe('TranslationTechniquesComponent', () => {
  let component: TranslationTechniquesComponent;
  let fixture: ComponentFixture<TranslationTechniquesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TranslationTechniquesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TranslationTechniquesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
