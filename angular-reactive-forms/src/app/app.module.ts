import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ReactiveFormComponent } from './reactive-form/reactive-form.component';
import { ShowErrorComponent } from './show-error/show-error.component';
import { GeneratedFormComponent } from './generated-form/generated-form.component';
import { ButtonChooserComponent } from './button-chooser/button-chooser.component';
import { RegisterFormComponent } from './register-form/register-form.component';

@NgModule({
  declarations: [
    AppComponent,
    ReactiveFormComponent,
    ShowErrorComponent,
    GeneratedFormComponent,
    ButtonChooserComponent,
    RegisterFormComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
