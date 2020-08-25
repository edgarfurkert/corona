import {Injectable} from '@angular/core';
import {
    CanActivate,
    Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';
import {Observable} from 'rxjs';
import {LoginService} from '../services/login-service/login-service';

@Injectable({
    providedIn: 'root'
})
export class LoginGuard implements CanActivate {

    constructor(private loginService: LoginService,
                private router: Router) {
    }

    canActivate(routeSnapshot: ActivatedRouteSnapshot,
                routerSnapshot: RouterStateSnapshot): Observable<boolean> | boolean {

        console.log(routeSnapshot);
        console.log(routerSnapshot);

        if (!this.loginService.isLoggedIn()) {
            const redirect = encodeURI(routerSnapshot.url);
            this.router.navigate(['/login'], {queryParams: {redirect: redirect}});
        }
        return true;
    }
}
