import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-button-chooser-bridge',
  templateUrl: './button-chooser-bridge.component.html',
  styleUrls: ['./button-chooser-bridge.component.css']
})
export class ButtonChooserBridgeComponent implements OnInit {

  @Input() choices = [];
  @Input() choicesString = '';
  @Input() value: string = null;
  @Output() valueChanged = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.choicesString) {
      console.log('ButtonChooserBridge: choicesString', changes.choicesString.currentValue);
      this.choices = changes.choicesString.currentValue.split(',');
    }
    if (changes.value) {
      console.log('ButtonChooserBridge: value', changes.value.currentValue);
    }
  }
}
