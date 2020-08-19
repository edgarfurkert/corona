import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestComponent } from './test.component';
import { TabsModule } from '../tabs.module';

fdescribe('TestComponent-override', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ TabsModule ],
      declarations: [ TestComponent ]
    });

    console.log('Test: overrideComponent')
    TestBed.overrideComponent(TestComponent, {
      remove: {
        templateUrl: './test.component.html'
      },
      add: {
        template: `
          <ch-tabs>
            <ch-tab title="Tab1">
              <span id="content">Content1</span>
            </ch-tab>
          </ch-tabs>
          `
      }
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should allow HTML in the Tab-Body', (done) => {
    console.log('Test: compileComponents')
    TestBed.compileComponents().then(() => {
      console.log('Test: createComponent')
      const fixture = TestBed.createComponent(TestComponent);
      fixture.autoDetectChanges(true);

      expect(fixture.nativeElement.querySelector('#content').textContent).toContain('Content1');

      done();
    });
  });
});
