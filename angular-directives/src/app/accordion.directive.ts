import { Directive, Input, ContentChildren, QueryList } from '@angular/core';
import { PanelComponent } from './panel/panel.component';

@Directive({
  selector: 'efAccordion, [efAccordion]',
  exportAs: 'accordion'
})
export class AccordionDirective {

  @Input() onlyOneOpen;
  @ContentChildren(PanelComponent) panels: QueryList<PanelComponent>;

  constructor() { }

  ngAfterContentInit() {
    this.panels.forEach((panel) => {
      panel.open = false;
      /** panelToggle is an EventEmitter. Register an anonymous callback function in the panel.  */
      panel.panelToggled.subscribe(panel => {
        if (panel.open && this.onlyOneOpen == 'true') {
          this.closeOthers(panel);
        }
      })
    });
  }

  closeOthers(opened: PanelComponent) {
    this.panels.forEach((panel) => {
      if (opened != panel && panel.open) {
        panel.open = false;
      }
    });
  }

  closeAll() {
    this.panels.forEach((panel) => {
      panel.open = false;
    });
  }
}
