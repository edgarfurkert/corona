import { NgModule } from '@angular/core';
import { Title, BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import * as io from 'socket.io-client';

import { AppComponent } from './app.component';
import { appRouting, routingComponents } from './app.routing';
import { SOCKET_IO, AUTH_ENABLED } from './app.tokens';
import { environment } from '../environments/environment';
import { mockIO } from './mocks/mock-socket';
//import { TasksModule } from './tasks/tasks.module';
import { SharedModule } from './shared/shared.module';

export function socketIoFactory() {
  if (environment.e2eMode) {
    return mockIO;
  }
  return io;
}

const enableAuthentication = !environment.e2eMode;

@NgModule({
  imports: [
    BrowserModule, // nur in App-Modul verwenden!
    ReactiveFormsModule,
    //FormsModule,        -> SharedModule
    //HttpClientModule,   -> SharedModule
    appRouting,
    //TasksModule,        -> Lazy-Loading in app.routing
    SharedModule.forRoot() // erweitertes SharedModule importieren
  ],
  providers: [
    Title,
    { provide: AUTH_ENABLED, useValue: enableAuthentication },
    { provide: SOCKET_IO, useFactory: socketIoFactory },
  ],
  declarations: [
    AppComponent,
    routingComponents
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
