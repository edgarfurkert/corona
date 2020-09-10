import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';


@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  title: string;
  platform: string;

  constructor(r: ActivatedRoute, private router: Router, private titleService: Title, @Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(platformId)) {
      this.platform = 'Ausführung im Browser';
    }
    if (isPlatformServer(platformId)) {
      this.platform = 'Ausführung auf dem Server';
    }
  }

  originalTitle: string;

  ngOnInit() {
    this.originalTitle = this.titleService.getTitle();
    if (this.title) {
      this.titleService.setTitle(this.title);
    }
  }
  ngOnDestroy() {
    this.titleService.setTitle(this.originalTitle);
  }

}
