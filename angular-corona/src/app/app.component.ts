import { Component, Inject, LOCALE_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router, NavigationEnd } from '@angular/router';
import { SessionService } from './services/session.service';

@Component({
  selector: 'ef-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-corona';
  menuTitle: string = 'analysis';

  constructor(@Inject(LOCALE_ID) private locale: string, 
              private translate: TranslateService, 
              private router: Router,
              private session: SessionService) {
    this.translate.setDefaultLang('en');
    this.translate.use(this.locale);

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd ) {
        if (event.url.includes('analysis')) {
          this.menuTitle = 'analysis';
        } else if (event.url.includes('datainfo')) {
          this.menuTitle = 'information';
        }
      }
    });

    this.session.set('date', new Date());
  }

  ngOnInit() {
  }
}
