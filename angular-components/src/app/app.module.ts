import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AttributeSelectorCliComponent } from './attribute-selector-cli/attribute-selector-cli.component';
import { ClassSelectorCliComponent, SpanClassSelectorCliComponent, NotClassSelectorCliComponent } from './class-selector-cli/class-selector-cli.component';
import { TimePickerComponent } from './time-picker/time-picker.component';
import { BlogEntryComponent } from './blog-entry/blog-entry.component';
import { CalendarComponent } from './calendar/calendar.component';
import { PanelModule } from './panel/panel.module';
import { TabsModule } from './tabs/tabs.module';
import { LifecycleDemoModule } from './lifecycle-demo/lifecycle-demo.module';

@NgModule({
  declarations: [
    AppComponent,
    AttributeSelectorCliComponent,
    ClassSelectorCliComponent,
    SpanClassSelectorCliComponent,
    NotClassSelectorCliComponent,
    TimePickerComponent,
    BlogEntryComponent,
    CalendarComponent
  ],
  imports: [
    BrowserModule, PanelModule, TabsModule, LifecycleDemoModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
