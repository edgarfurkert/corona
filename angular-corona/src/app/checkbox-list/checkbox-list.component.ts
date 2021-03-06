import { Component, OnInit, ViewChild, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';

import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { NGXLogger } from 'ngx-logger';

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
  encapsulation: ViewEncapsulation.None,
  templateUrl: './checkbox-list.component.html',
  styleUrls: ['./checkbox-list.component.scss']
})
export class CheckboxListComponent implements OnInit, OnChanges {

  @Input() columnHeader: string = 'Header';
  @Input() items: CheckboxItem[] = [];
  private _log: boolean = false;
  @Input()
  set log(value: string) {
    this._log = value === 'true';
  }
  get log(): string {
    return this._log.toString();
  }
  @Input('selected') selectedItems: CheckboxItem[] = [];
  @Output() selectItem = new EventEmitter();

  displayedColumns: string[] = ['select', 'text'];
  dataSource: MatTableDataSource<CheckboxItem> = new MatTableDataSource<CheckboxItem>([]);
  selected: string;

  @ViewChild(MatSort) sort: MatSort;

  selection = new SelectionModel<CheckboxItem>(true, []);

  constructor(private logger: NGXLogger) {
    if (this._log) {
      this.logger.debug('CheckboxListComponent');
    }
  }

  ngOnInit(): void {
    if (this._log) {
      this.logger.debug('CheckboxListComponent.ngOnInit');
    }

    this.dataSource.data = this.items;
    if (this._log) {
      this.logger.debug('CheckboxListComponent.ngOnInit', this.dataSource);
    }
  }

  ngAfterViewInit() {
    if (this._log) {
      this.logger.debug('CheckboxListComponent.ngAfterViewInit');
    }
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this._log) {
      this.logger.debug('CheckboxListComponent.ngOnChanges', changes);
    }
    if (changes['items']) {
      this.dataSource.data = this.items;
      // merge selection
      let selectedItemIds: string[] = [];
      this.selection.selected.forEach(item => {
        selectedItemIds.push(item.id);
      });
      this.selection.clear();
      this.items.forEach(item => {
        if (selectedItemIds.includes(item.id)) {
          if (this._log) {
            this.logger.debug('CheckboxListComponent.ngOnChanges: select', item);
          }
          this.selection.select(item);
        }
      });
    }
    if (changes['selectedItems']) {
      let selectedItemIds: string[] = [];
      if (this.selectedItems) {
        // merge selection
        this.selectedItems.forEach(item => {
          selectedItemIds.push(item.id);
        });
      }
      this.selection.clear();
      this.items.forEach(item => {
        if (selectedItemIds.includes(item.id)) {
          if (this._log) {
            this.logger.debug('CheckboxListComponent.ngOnChanges: select', item);
          }
          this.selection.select(item);
        }
      });
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (this._log) {
      this.logger.debug('CheckboxListComponent.applyFilter: filterValue', filterValue);
    }
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    /*
    if (this.log) {
      this.logger.debug('CheckboxListComponent.isAllSelected');
    }
    */
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this._log) {
      this.logger.debug('CheckboxListComponent.masterToggle: isAllSelected', this.isAllSelected());
    }
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: CheckboxItem): string {
    if (row) {
      if (this.selected !== JSON.stringify(this.selection.selected)) {
        if (this._log) {
          this.logger.debug('CheckboxListComponent.checkboxLabel: row', row);
        }
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
