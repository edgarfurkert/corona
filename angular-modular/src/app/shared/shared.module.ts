import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { ShowErrorComponent } from './show-error/show-error.component';
import { APPLICATION_VALIDATORS } from './models/app-validators';
import { AbstractCacheService } from './cache/abstract-cache.service';
import { InMemoryCacheService } from './cache/in-memory-cache.service';



@NgModule({
  declarations: [
    ShowErrorComponent,
    APPLICATION_VALIDATORS
  ],
  imports: [
    CommonModule
  ],
  // Definition der 'öffentlichen' Schnittstelle des Moduls
  exports: [
    ShowErrorComponent,
    APPLICATION_VALIDATORS,
    HttpClientModule,
    FormsModule
  ]
})
export class SharedModule { 
  /**
   * SharedModule um Provider erweitern
   */
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [
        {provide: AbstractCacheService, useClass: InMemoryCacheService}
      ]
    }
  }
}
