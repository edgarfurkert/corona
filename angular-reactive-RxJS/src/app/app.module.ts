import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RxDemoComponent } from './rx-demo/rx-demo.component';
import { TasksComponent } from './tasks/tasks.component';
import { TaskListComponent } from './tasks/task-list/task-list.component';
import { TaskItemComponent } from './tasks/task-item/task-item.component';
import { TaskOverviewComponent } from './tasks/task-overview/task-overview.component';

@NgModule({
  declarations: [
    AppComponent,
    RxDemoComponent,
    TasksComponent,
    TaskListComponent,
    TaskItemComponent,
    TaskOverviewComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
