import { Injectable }    from '@angular/core';
import {CanActivate, CanLoad, Route,  Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable }    from 'rxjs';
import { LoginService } from '../services/login-service/login.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate, CanLoad {
  constructor(private loginService: LoginService, private router: Router) {
  }
  private checkLogin(redirect: string) {
    if (!this.loginService.isLoggedIn()) {
      this.router.navigate(['/login'], {queryParams: {redirect: redirect}});
      return false;
    }
    return true;
  }
  canActivate(routeSnapshot: ActivatedRouteSnapshot,
              routerSnapshot: RouterStateSnapshot): Observable<boolean> | boolean {
    const redirect = encodeURI(routerSnapshot.url);
    return this.checkLogin(redirect);
  }
  canLoad(route: Route): Observable<boolean> | boolean {
    const redirect = encodeURI(route.path);
    return this.checkLogin(redirect);
  }
}
