import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ButtonChooserModule } from 'ef-button-chooser';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ButtonChooserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
