import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../services/login.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(private loginService: LoginService, private router: Router) {
  }

  /**
   * 
   * @param next  ActivatedRouteSnapshot
   * @param state RouterStateSnapshot
   * @returns Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
   */
  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    console.log('LoginGuard.canActivate');
    if (!this.loginService.isLoggedIn()) {
      const url = encodeURI(state.url);
      this.router.navigate(['/login'], { queryParams: { redirect: url } });
    }

    return true;
  }
  
}
