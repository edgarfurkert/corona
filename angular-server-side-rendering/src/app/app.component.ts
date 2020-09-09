import { Component, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

@Component({
  selector: 'ef-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-server-side-rendering';

  platform: string;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(platformId)) {
      this.platform = 'Ausführung im Browser';
    }
    if (isPlatformServer(platformId)) {
      this.platform = 'Ausführung auf dem Server';
    }
  }
}
