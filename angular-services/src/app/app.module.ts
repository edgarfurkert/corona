import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { LoginService } from './login.service';
import { OAuthLoginService } from './oauth-login.service';
import { UserService } from './services/user-service/user.service'

import { RANDOM_VALUE } from './app-tokens';
import { UserBadgeComponent } from './user-badge/user-badge.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { MusicLibraryComponent } from './music-library/music-library.component';
import { VideoLibraryComponent } from './video-library/video-library.component';
import { MusicSearchService } from './services/search-services/music-search.service';
import { MainViewComponent } from './main-view/main-view.component';
import { DirectoryComponent } from './directory/directory.component';
import { AlertDirective } from './alert.directive';
import { BorderDirective } from './border.directive';

export function generateRandomValue() {
  return Math.floor(Math.random() * 101);
}

export function getLoginService(useOAuth: boolean) {
  if (useOAuth) {
    return new OAuthLoginService();
  }

  return new LoginService();
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserBadgeComponent,
    SearchBarComponent,
    MusicLibraryComponent,
    VideoLibraryComponent,
    MainViewComponent,
    DirectoryComponent,
    AlertDirective,
    BorderDirective
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    // useClass
    //{ provide: LoginService, useClass: LoginService },
    // useValue
    { provide: 'greeting', useValue: 'Howdy' },
    // useFactory with Injection-String
    { provide: 'random-value', useFactory: generateRandomValue },

    { provide: 'ENABLE_OAUTH', useValue: true },
    { provide: LoginService, useFactory: getLoginService, deps: ['ENABLE_OAUTH'] },
    // useExisting
    { provide: 'currentLoginService', useExisting: LoginService },
    // useFactory with Injection-Token (better than Injection-String, because errors are shown at compile time)
    { provide: RANDOM_VALUE, useFactory: generateRandomValue },

    //{ provide: UserService, useClass: UserService }
    //UserService
    // UserService is providedIn: 'root', so there is no registration necessary
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
