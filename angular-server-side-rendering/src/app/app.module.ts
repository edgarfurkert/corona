import { BrowserModule, Title, BrowserTransferStateModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import * as io from 'socket.io-client';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { mockIO } from './mocks/mock-socket';
import { LoginService } from './services/login-service/login.service';
import { SOCKET_IO, AUTH_ENABLED } from './app.tokens';
import { routingComponents } from './app-routing.module';
import { SharedModule } from './shared/shared-module';


export function socketIoFactory() {
  if (environment.e2eMode) {
    return mockIO;
  }
  return io;
}

const enableAuthentication = true; // !environment.e2eMode;


@NgModule({
  declarations: [
    AppComponent,
    routingComponents
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'ef-angular-server-side-rendering'}),
    AppRoutingModule,
    SharedModule.forRoot(),
    BrowserTransferStateModule
  ],
  providers: [
    LoginService,
    Title,
    {provide: AUTH_ENABLED, useValue: enableAuthentication},
    {provide: SOCKET_IO, useFactory: socketIoFactory}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
