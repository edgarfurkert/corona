import { Component, OnInit, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'view-child',
  templateUrl: './view-child.component.html',
  styleUrls: ['./view-child.component.css']
})
export class ViewChildComponent implements OnInit {

  @Input() text: string;
  @Input() greeting: any;
  private previousGreetingText = '';
  
  constructor() { 
    console.log('ViewChildComponent.text: ', this.text);
  }

  ngOnInit() {
    console.log('ViewChild ngOnInit');
    console.log('Text: ', this.text);
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('ViewChild ngOnChanges: ', changes);
    console.log('Previous Text: ', changes['text'].previousValue);
    console.log('New Value    : ', changes['text'].currentValue);
  }

  ngAfterViewChecked() {
    console.log('ViewChild ngAfterViewChecked');
  }

  ngAfterContentChecked() {
    console.log('ViewChild ngAfterContentChecked');
  }

  ngDoCheck() {
    if (this.greeting !== undefined && this.greeting.text !== this.previousGreetingText) {
      this.previousGreetingText = this.greeting.text;
      console.log('ViewChild: New greeting text = ', this.greeting.text);
    }
  }
}
