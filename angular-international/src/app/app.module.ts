import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
//import { registerLocaleData } from '@angular/common';
//import localeFr from '@angular/common/locales/fr';

import { AppComponent } from './app.component';
import { TranslationTechniquesComponent } from './translation-techniques/translation-techniques.component';
import { TabsModule } from './tabs/tabs.module';
import { PluralizationComponent } from './pluralization/pluralization.component';
import { TodoCounterComponent } from './todo-counter/todo-counter.component';
import { GenderComponent } from './gender/gender.component';

//registerLocaleData(localeFr, 'fr');

@NgModule({
  declarations: [
    AppComponent,
    TranslationTechniquesComponent,
    PluralizationComponent,
    TodoCounterComponent,
    GenderComponent
  ],
  imports: [
    BrowserModule,
    TabsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
