import {Injectable} from '@angular/core';
import {
    CanActivate,
    Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    CanLoad,
    Route
} from '@angular/router';
import {Observable} from 'rxjs';
import {LoginService} from '../services/login-service/login-service';

@Injectable({
    providedIn: 'root'
})
export class LoginGuard implements CanActivate, CanLoad {

    constructor(private loginService: LoginService,
                private router: Router) {
    }

    private checkLogin(redirect: string) {
        if (!this.loginService.isLoggedIn()) {
            this.router.navigate(['/login'], {queryParams: {redirect: redirect}});
            return false;
        }
        return true;
    }

    /**
     * Für die Nutzung von Modulen (siehe app-routing.ts: tasks)
     * 
     * @param route
     * @param segments 
     */
    canLoad(route: Route, 
            segments: import("@angular/router").UrlSegment[]): boolean | import("@angular/router").UrlTree | Observable<boolean | import("@angular/router").UrlTree> | Promise<boolean | import("@angular/router").UrlTree> {

        const redirect = encodeURI(route.path);
        return this.checkLogin(redirect);
    }

    canActivate(routeSnapshot: ActivatedRouteSnapshot,
                routerSnapshot: RouterStateSnapshot): Observable<boolean> | boolean {

        console.log(routeSnapshot);
        console.log(routerSnapshot);

        const redirect = encodeURI(routerSnapshot.url);
        return this.checkLogin(redirect);
    }
}
