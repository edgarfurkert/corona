import { Directive, ElementRef, Self, Optional } from '@angular/core';
import { AlertDirective } from './alert.directive';

@Directive({
  selector: '[efBorder]'
})
export class BorderDirective {

  // @Self(): Abhängigkeit nur innerhalb des aktuellen Injectors suchen
  constructor(private el: ElementRef, @Self() @Optional() alert: AlertDirective) {
    const borderWith = alert ? '3px' : '1px';
    this.el.nativeElement.style.border = 'solid ' + borderWith;
  }

}
