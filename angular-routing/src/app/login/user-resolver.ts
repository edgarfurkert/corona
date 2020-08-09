import {Injectable} from '@angular/core';
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { Observable } from 'rxjs';

import { LoginService, User } from '../services/login.service';

@Injectable({
    providedIn: 'root'
})
export class UserResolver implements Resolve<User> {

    constructor(private loginService: LoginService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User> {
        return this.loginService.getCurrentUser();
    }
}