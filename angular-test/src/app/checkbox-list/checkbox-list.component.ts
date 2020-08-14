import { Component, OnInit } from '@angular/core';
import { CheckboxItem } from './models/model-interfaces';

@Component({
  selector: 'ef-checkbox-list',
  templateUrl: './checkbox-list.component.html',
  styleUrls: ['./checkbox-list.component.css']
})
export class CheckboxListComponent implements OnInit {

  items: CheckboxItem[] = [];

  constructor() { }

  ngOnInit(): void {
    this.items.push({id:'item1', label:'Item 1'});
    this.items.push({id:'item2', label:'Item 2'});
    this.items.push({id:'item3', label:'Item 3'});
    this.items.push({id:'item4', label:'Item 4'});
    this.items.push({id:'item5', label:'Item 5'});
  }

  change(item) {
    item.state = !item.state;
    console.log('CheckboxList: change of item', item);
  }
}
