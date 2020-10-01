import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { TestComponent } from './test.component';
import { TabsModule } from '../tabs.module';

describe('TabsTestComponent-fakeAsync', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ TabsModule ],
      declarations: [ TestComponent ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it ('should be possible to simulate time', fakeAsync(() => {
    let called = false;
    setTimeout(() => {
      called = true;
    }, 100);

    expect(called).toBe(false);
    tick(100);
    expect(called).toBe(true);
  }));
});
