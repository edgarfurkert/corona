import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CheckboxListComponent } from './checkbox-list/checkbox-list.component';
import { CheckboxItemComponent } from './checkbox-list/checkbox-item/checkbox-item.component';

@NgModule({
  declarations: [
    AppComponent,
    CheckboxListComponent,
    CheckboxItemComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
