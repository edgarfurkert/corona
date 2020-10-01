import { Component, OnInit } from '@angular/core';

import { BabywatchService } from '../babywatch.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { AddEventComponent } from '../add-event/add-event.component';

@Component({
  selector: 'ef-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {

  constructor(private babyService: BabywatchService, private bottomSheet: MatBottomSheet) { }

  ngOnInit(): void {
  }

  getTimeline() {
    return this.babyService.timeline;
  }

  getBabyName() {
    return this.babyService.babyName || 'Das Baby';
  }

  addEvent() {
    //this.babyService.addRandomTimelineEvent();
    this.bottomSheet.open(AddEventComponent);
  }
}
