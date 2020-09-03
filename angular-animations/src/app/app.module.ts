import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TabsModule } from './tabs/tabs.module';
import { PanelModule } from './panel/panel.module';
import { KeyframesComponent } from './keyframes/keyframes.component';
import { TodoItemComponent } from './todo-item/todo-item.component';
import { GroupingComponent } from './grouping/grouping.component';
import { QueryingComponent } from './querying/querying.component';
import { StaggeringComponent } from './staggering/staggering.component';
import { appRouting } from './app.routing';
import { AutoCalculationComponent } from './auto-calculation/auto-calculation.component';

@NgModule({
  declarations: [
    AppComponent,
    KeyframesComponent,
    TodoItemComponent,
    GroupingComponent,
    QueryingComponent,
    StaggeringComponent,
    AutoCalculationComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    TabsModule,
    PanelModule,
    appRouting
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
