import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import de from '@angular/common/locales/de';
import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TimelineComponent } from './timeline/timeline.component';
import { SettingsComponent } from './settings/settings.component';
import { AddEventComponent } from './add-event/add-event.component';
import { DeleteTimelineDialogComponent } from './delete-timeline-dialog/delete-timeline-dialog.component';
import { DataTableComponent } from './data-table/data-table.component';

// zur korrekten Formatierung des Datums in der Timeline
registerLocaleData(de);

@NgModule({
  declarations: [
    AppComponent,
    TimelineComponent,
    SettingsComponent,
    AddEventComponent,
    DeleteTimelineDialogComponent,
    DataTableComponent
  ],
  entryComponents: [
    AddEventComponent,
    DeleteTimelineDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatCardModule,
    MatBottomSheetModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatExpansionModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTableModule,
    MatSortModule,
    MatCheckboxModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'de-de' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 
  // Registrierung der Icons
  constructor(private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer) {
    this.iconRegistry.addSvgIcon("feed", this.sanitizer.bypassSecurityTrustResourceUrl("../assets/feed.svg"));
    this.iconRegistry.addSvgIcon("bath", this.sanitizer.bypassSecurityTrustResourceUrl("../assets/bath.svg"));
    this.iconRegistry.addSvgIcon("diaper", this.sanitizer.bypassSecurityTrustResourceUrl("../assets/diaper.svg"));
    this.iconRegistry.addSvgIcon("sleep", this.sanitizer.bypassSecurityTrustResourceUrl("../assets/sleep.svg"));
  }
}
