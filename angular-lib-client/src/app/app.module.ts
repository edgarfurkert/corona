import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { ButtonChooserModule } from 'ef-button-chooser';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ButtonChooserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
