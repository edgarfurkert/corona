import { Component, Inject, LOCALE_ID, ViewChildren, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router, NavigationEnd } from '@angular/router';
import { SessionService } from './services/session.service';
import { Refreshable } from './models/model.interfaces';

@Component({
  selector: 'ef-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-corona';
  menuSelection: string = 'analysis';

  private routedComponent: Refreshable;

  constructor(@Inject(LOCALE_ID) private locale: string, 
              private translate: TranslateService, 
              private router: Router,
              private session: SessionService) {
    this.translate.setDefaultLang('en');
    this.translate.use(this.locale);

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd ) {
        if (event.url.includes('analysis')) {
          this.menuSelection = 'analysis';
        } else if (event.url.includes('datainfo')) {
          this.menuSelection = 'information';
        }
      }
    });
  }

  ngOnInit() {
  }

  public setRoutedComponent(componentRef: Refreshable) {
    this.routedComponent = componentRef;
    //console.log('setRoutedComponent', this.routedComponent);
  }

  doRefresh() {
    //console.log('AppComponent: refresh', this.routedComponent);
    this.routedComponent.refresh();
  }
}
