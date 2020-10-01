import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JsonpExampleComponent } from './jsonp-example.component';

describe('JsonpExampleComponent', () => {
  let component: JsonpExampleComponent;
  let fixture: ComponentFixture<JsonpExampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JsonpExampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JsonpExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
