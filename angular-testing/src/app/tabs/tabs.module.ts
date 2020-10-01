import {NgModule} from '@angular/core';
import {TabsComponent, TabComponent} from './tabs.component';
import {CommonModule} from '@angular/common';
import { TestComponent } from './test/test.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ TabsComponent, TabComponent, TestComponent],
  exports: [TabsComponent, TabComponent, TestComponent]
})
export class TabsModule {
}
