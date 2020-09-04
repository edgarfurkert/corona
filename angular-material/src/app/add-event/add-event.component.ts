import { Component, OnInit } from '@angular/core';
import { BabywatchService, timelineEventTypes, TimelineEventType } from '../babywatch.service';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'ef-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent implements OnInit {

  eventType: string;

  constructor(private babyService: BabywatchService, private bottomSheetRef: MatBottomSheetRef<AddEventComponent>) { }

  ngOnInit(): void {
  }

  getBabyName() {
    return this.babyService.babyName;
  }

  getEventTypes() {
    return timelineEventTypes;
  }

  addEvent(data: { eventType: TimelineEventType, comment: string }) {
    // save data
    this.babyService.addTimelineEvent({
      date: new Date(),
      eventType: data.eventType,
      comment: data.comment
    });
    // close dialog
    this.bottomSheetRef.dismiss();
  }
}
