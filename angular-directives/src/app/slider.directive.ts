import { Directive, ElementRef, Input, Output, EventEmitter } from '@angular/core';

declare var jQuery: any;
declare var $: any;

@Directive({
  selector: '[efSlider]'
})
export class SliderDirective {

  sliderRef: any;
  @Input() value: number;
  @Output() valueChange = new EventEmitter();

  constructor(private elementRef: ElementRef) { 
    this.sliderRef = jQuery(elementRef.nativeElement).slider({
      slide: (event, ui) => {
        //console.log(ui.value);
        this.valueChange.emit(ui.value);
      }
    });
  }

  ngOnChanges() {
    /** set slider option 'value' */
    this.sliderRef.slider('option', {value: this.value});
  }
}
