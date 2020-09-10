import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ShowErrorComponent} from './show-error/show-error.component';
import {APPLICATION_VALIDATORS} from './models/app-validators';
import {TaskStore} from './stores/task.store';
import {TaskService} from './task-service/task.service';
import {HttpClientModule} from '@angular/common/http';
import {AbstractCacheService} from './cache/abstract-cache.service';
import {InMemoryCacheService} from './cache/in-memory-cache.service';

@NgModule({
  imports: [CommonModule],
  declarations: [ShowErrorComponent, APPLICATION_VALIDATORS],
  exports: [CommonModule, HttpClientModule, FormsModule,
            ShowErrorComponent, APPLICATION_VALIDATORS]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        {provide: AbstractCacheService, useClass: InMemoryCacheService}
      ]
    };
  }
}
