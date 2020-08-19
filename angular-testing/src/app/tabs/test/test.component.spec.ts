import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestComponent } from './test.component';
import { TabsModule } from '../tabs.module';

fdescribe('TestComponent', () => {
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

  it('should switch the content when clicking the header', () => {
    const element = fixture.nativeElement;
    fixture.autoDetectChanges(true);

    // Default: Tab 1 ist aktiviert
    expect(element.querySelector('.tab-content').textContent).toContain('Content 1');
    expect(element.querySelector('.tab-content').textContent).not.toContain('Content 2');

    // Aktiviere Tab 2
    element.querySelectorAll('li')[1].click();

    expect(element.querySelector('.tab-content').textContent).not.toContain('Content 1');
    expect(element.querySelector('.tab-content').textContent).toContain('Content 2');

    // Aktiviere Tab 1
    element.querySelectorAll('li')[0].click();

    expect(element.querySelector('.tab-content').textContent).toContain('Content 1');
    expect(element.querySelector('.tab-content').textContent).not.toContain('Content 2');
  });
});
