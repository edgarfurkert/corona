import { Injectable } from '@angular/core';

export class User {
  constructor(public name: string) {}
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private loggedInUser: User;

  constructor() { 
    this.loggedInUser = new User('Edgar');
  }

  getLoggedInUser() {
    return this.loggedInUser;
  }
}
