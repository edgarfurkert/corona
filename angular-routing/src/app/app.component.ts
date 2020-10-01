import { Component, Optional, Inject } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { filter } from 'rxjs/internal/operators';

import { AUTH_ENABLED } from './app.tokens';
import { LoginService } from './services/login.service';

@Component({
  selector: 'ef-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  defaultTitle: string;

  constructor(@Optional() @Inject(AUTH_ENABLED) public authEnabled,
              public loginService: LoginService,
              private activatedRoute: ActivatedRoute, 
              private router: Router, 
              private titleService: Title) {
  }

  ngOnInit() {
    this.defaultTitle = this.titleService.getTitle();
    // Router events:
    // - NavigationStart
    // - RoutesRecognized
    // - NavigationEnd
    this.router.events.pipe(filter(event => event instanceof NavigationEnd))
                      .subscribe(event => {
                        this.setBrowserTitle();
                      });
  }

  setBrowserTitle() {
    let title = this.defaultTitle;
    let route = this.activatedRoute;

    while (route.firstChild) {
      route = route.firstChild;
      console.log('AppComponent: route = ', route);
      title = route.snapshot.data['title'] || title;
    }

    this.titleService.setTitle(title);
  }

  toggleChat() {
    if (!this.router.url.includes('chat')) {
      // { outlets: {'outletName': ['path']} }
      this.router.navigate([{ outlets: {'bottom': ['chat']} }]);
    } else {
      // { outlets: {'outletName': null} }
      this.router.navigate([{ outlets : {'bottom': null} }]);
    }
  }

  logout() {
    this.loginService.logout();
    this.router.navigate(['login']);
    return false;
  }

}
