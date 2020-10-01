import { enableProdMode, TRANSLATIONS, TRANSLATIONS_FORMAT, LOCALE_ID } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

function makeRequest (method, url, done) {
  console.log('makeRequest: url', url);
  const xhr = new XMLHttpRequest();
  xhr.open(method, url);
  xhr.onload = function () {
    done(null, xhr.response);
  };
  xhr.onerror = function () {
    done(xhr.response);
  };
  xhr.send();
}

const locale = (<any>document).locale;

makeRequest('GET', `assets/locales/messages.${locale}.xlf`, (err, translations) => {
  platformBrowserDynamic().bootstrapModule(AppModule, {
    providers: [
      {provide: TRANSLATIONS, useValue: translations},
      {provide: TRANSLATIONS_FORMAT, useValue: 'xlf'},
      {provide: LOCALE_ID, useValue: locale}]

  });
});