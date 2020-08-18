import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EmailValidatorDirective } from './directives/email-validator.directive';
import { TimePickerComponent } from './time-picker/time-picker.component';
import { TaskItemComponent } from './tasks/task-item/task-item.component';
import { TaskListComponent } from './tasks/task-list/task-list.component';
import {SOCKET_IO, AUTH_ENABLED} from './app.tokens';
import {environment} from '../environments/environment';
import {mockIO} from './mocks/mock-socket';
import * as io from 'socket.io-client';

export function socketIoFactory() {
  if (environment.e2eMode) {
    return mockIO;
  }
  return io;
}

@NgModule({
  declarations: [
    AppComponent,
    EmailValidatorDirective,
    TimePickerComponent,
    TaskItemComponent,
    TaskListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    {provide: SOCKET_IO, useFactory: socketIoFactory}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
