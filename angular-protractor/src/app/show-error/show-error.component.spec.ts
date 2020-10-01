
import {NgForm, FormsModule, ReactiveFormsModule} from '@angular/forms';


import {
  ComponentFixture
} from '@angular/core/testing'

import {By} from '@angular/platform-browser';
import {ShowErrorComponent} from './show-error.component';
import {TestBed} from '@angular/core/testing';

export class FakeForm {
  constructor(private control: any) {
  }

  get(str: string) {
    return this.control;
  }
}



describe('ShowError Component', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
       imports: [FormsModule, ReactiveFormsModule],
      declarations: [ShowErrorComponent],
      providers: [NgForm]
    });
  });


  let fixture: ComponentFixture<ShowErrorComponent>;

  it('should display "required" error for touched controls', (done) => {
    fixture = TestBed.createComponent(ShowErrorComponent);
    fixture.whenStable().then(() => {
        const showErrorCmp: ShowErrorComponent = fixture.componentInstance;
        const element = fixture.nativeElement;
        (<any>showErrorCmp).form = new FakeForm({
          touched: true,
          errors: {
            required: true
          }
        });
        (<any>showErrorCmp).displayName = 'Vorname';
        fixture.detectChanges(); //Change-Detection auslösen
        expect(element.querySelector('.alert-danger').textContent)
          .toContain('Vorname ist ein Pflichtfeld');
        done();
      });
  });

  it('should display no errors for untouched controls', () => {
    fixture = TestBed.createComponent(ShowErrorComponent);

    const showErrorCmp: ShowErrorComponent = fixture.componentInstance;
    const fakeControl: any = {touched: false, errors: {required: true}};
    (<any>showErrorCmp).form = new FakeForm(fakeControl);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.alert-danger')).toBeNull();
    expect(fixture.debugElement.query(By.css('.alert-danger'))).toBeNull();
  });
});





