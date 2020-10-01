import {Inject, Injectable, Optional} from '@angular/core'
import {AUTH_ENABLED} from '../../app.tokens';

const CURRENT_USER = 'currentUser';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  USERS = [
    {name: 'admin', password: 'admin', rights: ['edit_tasks', 'change_settings'] },
    {name: 'user', password: 'secret', rights: ['edit_tasks'] }
  ];

  constructor(@Optional() @Inject(AUTH_ENABLED) public authEnabled = false) {
  }

  login(name, password) {
    const [user] = this.USERS.filter(user => user.name === name);
    if (user && user.password === password) {
      localStorage.setItem(CURRENT_USER, JSON.stringify(user));
      return true;
    }
  }

  logout() {
    localStorage.removeItem(CURRENT_USER);
  }

  isLoggedIn() {
    return !this.authEnabled || localStorage.getItem(CURRENT_USER) != null;
  }

  getUser() {
    const userString = localStorage.getItem(CURRENT_USER);
    if (userString) {
      return JSON.parse(userString);
    }
  }

}
