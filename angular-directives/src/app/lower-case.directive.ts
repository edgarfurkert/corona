import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[efLowerCase]'
  /**
   * Alternativ:
   * host: {
   *  '[value]': 'lcValue',
   *  '(change)': 'onChange($event)'
   * }
   */
})
export class LowerCaseDirective {

  /** bindet das value-Property des Eingabefeldes an die lcValue-Membervariable */
  /** @HostBinding() value = ''; */
  @HostBinding('value') lcValue = '';

  /** Beim Auslösen des change-Events des Input-Feldes wird die onChange-Methode aufgerufen */
  @HostListener('change', ['$event'])
  onChange($event) {
    this.lcValue = $event.target.value.toLowerCase();
  }

  constructor() { }

}
