import {
  Directive,
  Component,
  Input,
  Output,
  EventEmitter,
  ContentChild
} from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Directive({
  selector: 'ch-panel-header'
})
export class PanelHeaderDirective {
}

@Component({
  selector: 'ch-panel',
  templateUrl: 'panel.component.html',
  styleUrls: ['panel.component.css'],
  animations: [
    trigger('active', [
      state('closed', style({height: 0})),
      state('open', style({height: '*'})),
      transition('closed <=> open', [animate('3500ms ease-out')])
    ])
  ]
})
export class PanelComponent {

  open = true;
  @Input() title;
  @Output() panelToggled = new EventEmitter();
  @ContentChild(PanelHeaderDirective) panelHeader: PanelHeaderDirective;

  togglePanel() {
    this.open = !this.open;
    this.panelToggled.emit(this);
  }

  hasHeader() {
    return this.panelHeader != null;
  }
}

