import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonChooserComponent } from './button-chooser.component';



@NgModule({
  declarations: [ButtonChooserComponent],
  imports: [
    CommonModule
  ],
  exports: [ButtonChooserComponent]
})
export class ButtonChooserModule { }
