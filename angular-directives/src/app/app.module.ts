import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { BorderDirective } from './border.directive';
import { Border2Directive } from './border2.directive';
import { LowerCaseDirective } from './lower-case.directive';
import { SliderDirective } from './slider.directive';
import { PanelComponent } from './panel/panel.component';
import { AccordionDirective } from './accordion.directive';

@NgModule({
  declarations: [
    AppComponent,
    BorderDirective,
    Border2Directive,
    LowerCaseDirective,
    SliderDirective,
    PanelComponent,
    AccordionDirective
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
