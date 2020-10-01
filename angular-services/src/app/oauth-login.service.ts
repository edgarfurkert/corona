import { Injectable, Inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OAuthLoginService {

  constructor() { 
  }

  login(loginData: any) {
    console.log('OAuth: Executing login with data', loginData);
  }
}
