import { Component, OnInit } from '@angular/core';
import { BabywatchService } from '../babywatch.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DeleteTimelineDialogComponent } from '../delete-timeline-dialog/delete-timeline-dialog.component';

@Component({
  selector: 'ef-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(private babyService: BabywatchService, private snackbar: MatSnackBar, private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  getBabyName() {
    return this.babyService.babyName;
  }

  getBabyNameWithFallback() {
    return this.getBabyName() || 'das Baby';
  }

  saveBabyName(babyName: string) {
    this.babyService.babyName = babyName.trim();

    this.snackbar.open('Der Babyname wurde gespeichert', '', { duration: 2000 });
  }

  clearTimeline() {
    const dialogRef = this.dialog.open(DeleteTimelineDialogComponent, {
      width: '80%',
      maxWidth: '450px',
      data: this.getBabyNameWithFallback()
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.babyService.clearTimeline();

        this.snackbar.open('Die Timeline wurde gelöscht', '', { duration: 2000 });
      }
    });
  }
}
