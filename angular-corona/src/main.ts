import { enableProdMode, LOCALE_ID } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

const locale = (<any>document).locale;

platformBrowserDynamic().bootstrapModule(AppModule, {
  providers: [
    {provide: LOCALE_ID, useValue: locale}
  ]
}).catch(err => console.error(err));
