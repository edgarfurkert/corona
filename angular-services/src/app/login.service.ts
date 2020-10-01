import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor() { }

  login(loginData: any) {
    console.log('Executing login with data', loginData);
  }
}
