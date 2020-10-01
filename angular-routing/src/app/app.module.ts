import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';

import { AppRoutingModule, routingComponents, routingProviders } from './app-routing.module';
import { AppComponent } from './app.component';
import { TasksComponent } from './tasks/tasks.component';
import { TaskListComponent } from './tasks/task-list/task-list.component';
import { EditTaskComponent } from './tasks/edit-task/edit-task.component';
import { TaskItemComponent } from './tasks/task-item/task-item.component';
import { ShowErrorComponent } from './show-error/show-error.component';
import { LoginComponent } from './login/login.component';
import { AUTH_ENABLED } from './app.tokens';
import { NotFoundComponent } from './not-found/not-found.component';
import { TaskOverviewComponent } from './task-overview/task-overview.component';
import { ChatComponent } from './chat/chat.component';
import { JsonpExampleComponent } from './jsonp-example/jsonp-example.component';

@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    TasksComponent,
    TaskListComponent,
    EditTaskComponent,
    TaskItemComponent,
    ShowErrorComponent,
    LoginComponent,
    NotFoundComponent,
    TaskOverviewComponent,
    ChatComponent,
    JsonpExampleComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    AppRoutingModule
  ],
  providers: [
    // siehe auch index.html
    //{ provide: APP_BASE_HREF, useValue: '/project-manager/' }
    { provide: AUTH_ENABLED, useValue: true },
    routingProviders,
    Title // Angular-Title-Service
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
