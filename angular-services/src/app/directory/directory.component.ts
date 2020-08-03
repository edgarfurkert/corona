import { Component, OnInit, Optional, SkipSelf, Input } from '@angular/core';

@Component({
  selector: 'ef-directory',
  templateUrl: './directory.component.html',
  styleUrls: ['./directory.component.css']
})
export class DirectoryComponent implements OnInit {

  @Input() name: string;

  // @Optional(): parent kann auch null sein
  // @SkipSelf(): Lookup für die Abhängigkeit direkt beim Parent-Injector beginnen, sonst gibts einen Circular Dep Error!
  constructor(@Optional() @SkipSelf() private parent: DirectoryComponent) { }

  ngOnInit(): void {
    const parent = this.parent ? this.parent.name : 'null';
    console.log('Name: ' + this.name + ' Parent: ' + parent);
  }

}
