import { Component, OnInit, ViewChild, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';

const ELEMENT_DATA: CheckboxItem[] = [
  { id: '1', position: 1, text: 'Text 1', data: { territoryId: 'tid1' } },
  { id: '2', position: 2, text: 'Text 2', data: { territoryId: 'tid2' } },
  { id: '3', position: 3, text: 'Text 3', data: { territoryId: 'tid3' } },
  { id: '4', position: 4, text: 'Ein Text 4, der ganz lang ist', data: { territoryId: 'tid4' } },
  { id: '5', position: 5, text: 'Ein Text 5, der noch länger ist als Text 4', data: { territoryId: 'tid5' } }
];

export interface CheckboxItem {
  id?: string;
  position: number;
  text: string;
  data?: any;
}

@Component({
  selector: 'ef-checkbox-list',
  templateUrl: './checkbox-list.component.html',
  styleUrls: ['./checkbox-list.component.scss']
})
export class CheckboxListComponent implements OnInit {

  @Input() columnHeader: string = 'Header';
  @Input() items: CheckboxItem[];
  @Output() selectItem = new EventEmitter();

  displayedColumns: string[] = ['select', 'item'];
  dataSource: MatTableDataSource<CheckboxItem>;
  selected: string;

  @ViewChild(MatSort) sort: MatSort;

  selection = new SelectionModel<CheckboxItem>(true, []);

  constructor() { }

  ngOnInit(): void {
    console.log('CheckboxListComponent.ngOnInit', this.items);
    this.dataSource = new MatTableDataSource(this.items);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: CheckboxItem): string {
    if (row) {
      if (this.selected !== JSON.stringify(this.selection.selected)) {
        this.selected = JSON.stringify(this.selection.selected);

        let items: any[] = [];
        this.selection.selected.forEach(item => {
          items.push(item.data);
        });
        this.selectItem.emit(items);
      }
    }

    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

}
