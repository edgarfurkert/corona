import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelComponent, PanelHeaderDirective } from './panel.component';

@NgModule({
    imports: [CommonModule],
    declarations: [PanelComponent, PanelHeaderDirective],
    exports: [PanelComponent, PanelHeaderDirective]
})
export class PanelModule {
    
}