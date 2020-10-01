import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { AppComponent } from './app.component';
import { FirstFormComponent } from './first-form/first-form.component';
import { FirstFormOneWayComponent } from './first-form-one-way/first-form-one-way.component';
import { FirstFormTwoWayComponent } from './first-form-two-way/first-form-two-way.component';
import { FirstFormInterfacesComponent } from './first-form-interfaces/first-form-interfaces.component';
import { FirstFormClassesComponent } from './first-form-classes/first-form-classes.component';
import { TemplateDrivenFormComponent } from './template-driven-form/template-driven-form.component';
import { ShowErrorComponent } from './show-error/show-error.component';
import { APPLICATION_VALIDATORS } from './template-driven-form/app-validators'

@NgModule({
  declarations: [
    AppComponent,
    FirstFormComponent,
    FirstFormOneWayComponent,
    FirstFormTwoWayComponent,
    FirstFormInterfacesComponent,
    FirstFormClassesComponent,
    TemplateDrivenFormComponent,
    ShowErrorComponent,
    APPLICATION_VALIDATORS
  ],
  imports: [
    BrowserModule, FormsModule, ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
