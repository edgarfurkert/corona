import {NgModule} from '@angular/core';
import {Title, BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {AppComponent} from './app.component';
import {TaskService} from './services/task-service/task.service';
import {LoginService} from './services/login-service/login-service';
import {TaskStore} from './services/stores/task.store';
import {ShowErrorComponent} from './show-error/show-error.component';
import {APPLICATION_VALIDATORS} from './models/app-validators';
import {appRouting, routingComponents} from './app.routing';
import * as io from 'socket.io-client';
import {SOCKET_IO, AUTH_ENABLED} from './app.tokens';
import {environment} from '../environments/environment';
import {mockIO} from './mocks/mock-socket';
import {TaskItemComponent} from './tasks/task-list/task-item.component';
import {HttpClientModule} from '@angular/common/http';

export function socketIoFactory() {
  if (environment.e2eMode) {
    return mockIO;
  }
  return io;
}

const enableAuthentication = !environment.e2eMode;

@NgModule({
  imports: [BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    appRouting,
    HttpClientModule],
  providers: [
    Title,
    {provide: AUTH_ENABLED, useValue: enableAuthentication},
    {provide: SOCKET_IO, useFactory: socketIoFactory},
  ],
  declarations: [AppComponent,
    routingComponents,
    TaskItemComponent,
    ShowErrorComponent,
    APPLICATION_VALIDATORS],
  bootstrap: [AppComponent]
})
export class AppModule {
}
