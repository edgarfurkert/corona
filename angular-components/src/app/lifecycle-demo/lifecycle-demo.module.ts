import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ViewChildComponent } from './view-child/view-child.component';
import { ContentChildComponent } from './content-child/content-child.component';
import { LifecycleMainComponent } from './lifecycle-main/lifecycle-main.component';

@NgModule({
  declarations: [ViewChildComponent, ContentChildComponent, LifecycleMainComponent],
  imports: [
    CommonModule, FormsModule
  ],
  exports: [LifecycleMainComponent, ContentChildComponent]
})
export class LifecycleDemoModule { }
