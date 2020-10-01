import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';

import { AppComponent } from './app.component';
import { ButtonChooserBridgeComponent } from './button-chooser-bridge/button-chooser-bridge.component';
import { ButtonChooserModule } from 'ch-button-chooser';

@NgModule({
  declarations: [
    AppComponent,
    ButtonChooserBridgeComponent
  ],
  imports: [
    BrowserModule,
    ButtonChooserModule
  ],
  providers: [],
  bootstrap: [],
  entryComponents: [ 
    AppComponent, 
    ButtonChooserBridgeComponent
  ]
})
export class AppModule { 
  constructor(private injector: Injector) {

  }

  ngDoBootstrap() {
    const appElement = createCustomElement(AppComponent, {
      injector: this.injector
    });
    customElements.define('my-first-angular-element', appElement);

    const bcElement = createCustomElement(ButtonChooserBridgeComponent, {
      injector: this.injector
    });
    customElements.define('my-button-chooser', bcElement);
  }
}
