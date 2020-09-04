import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'ef-delete-timeline-dialog',
  templateUrl: './delete-timeline-dialog.component.html',
  styleUrls: ['./delete-timeline-dialog.component.scss']
})
export class DeleteTimelineDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public babyName: string) { }

  ngOnInit(): void {
  }

}
