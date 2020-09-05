import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';

import { PeriodicElement } from '../models/data-table.model';
import { DataTableService } from '../services/data-table/data-table.service';

const ELEMENT_DATA: PeriodicElement[] = [
  { id: '1', position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { id: '2', position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { id: '3', position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { id: '4', position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { id: '5', position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { id: '6', position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { id: '7', position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { id: '8', position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { id: '9', position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { id: '10', position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];


@Component({
  selector: 'ef-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit {

  displayedColumns: string[] = ['select', 'position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  dataSource2 = new MatTableDataSource<PeriodicElement>([]);

  @ViewChildren(MatSort) sorts: QueryList<MatSort>;

  selection = new SelectionModel<PeriodicElement>(true, []);
  selection2 = new SelectionModel<PeriodicElement>(true, []);

  constructor(private dataService: DataTableService) { }

  ngOnInit(): void {
    this.dataService.elements$.subscribe(elements => {
      this.dataSource2.data = elements;
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sorts.first;
    this.dataSource2.sort = this.sorts.last;
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
  checkboxLabel(row?: PeriodicElement): string {
    if (row) {
      this.dataService.setSelectedElements(this.selection.selected);
    }

    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
}
