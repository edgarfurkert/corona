import { Directive, Input, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[efBorder2]'
})
export class Border2Directive {

  @Input('efBorder2') border = 1;

  /** Use Renderer to be plattform independent */
  constructor(private elementRef: ElementRef, private renderer: Renderer2) { }

  ngOnChanges(change: any) {
    this.renderer.setStyle(this.elementRef.nativeElement, 
                           'border', 
                           `solid ${this.border}px`);
  }
}
