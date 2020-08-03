import { Directive, Input, ElementRef } from '@angular/core';

@Directive({
  selector: '[efBorder]'
})
export class BorderDirective {

  @Input() efBorder = 1;

  /** Dependency-Injection of current element, definition of the member variable "elementRef" */
  constructor(private elementRef: ElementRef) { }

  ngOnChanges() {
    const style = `solid ${this.efBorder}px`;
    this.elementRef.nativeElement.style.border = style;
  }

}
