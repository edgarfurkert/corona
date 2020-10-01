import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[efAlert]'
})
export class AlertDirective {

  constructor(private el: ElementRef) { 
    this.el.nativeElement.style.color = 'red';
    this.el.nativeElement.style['font-weight'] = 'BOLD';
  }

}
