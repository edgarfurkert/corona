import { Inject, Optional, Injectable } from '@angular/core';

import { AUTH_ENABLED } from '../../app.tokens';
import { ServerSideStorage } from './server-side-storage';

const CURRENT_USER = 'currentUser';

@Injectable({
  providedIn: 'root'
})
export class LoginService {


  USERS = [
    {name: 'admin', password: 'admin', rights: ['edit_tasks', 'change_settings'] },
    {name: 'user', password: 'secret', rights: ['edit_tasks'] }
  ];

  storage: Storage | ServerSideStorage;

  constructor(@Optional() @Inject(AUTH_ENABLED) public authEnabled = false) {

      if (typeof localStorage === "undefined" || localStorage === null) {
        this.storage = new ServerSideStorage();
      } else {
        this.storage = localStorage;
      }

   // try {
      //this.storage = localStorage;
  //  } catch (e) {
      // Server-Side: ingore...
  //  }
  }

  login(name, password) {
    const [user] = this.USERS.filter(user => user.name == name);
    if (user && user.password === password) {
      this.storage.setItem(CURRENT_USER, JSON.stringify(user));
      return true;
    }
  }

  logout() {
    this.storage.removeItem(CURRENT_USER);
  }

  isLoggedIn() {
    return !this.authEnabled || this.storage.getItem(CURRENT_USER) != null;
  }

  getUser() {
    const userString = this.storage.getItem(CURRENT_USER);
    if (userString) {
      return JSON.parse(userString);
    }
  }

}
