import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class BabywatchService {
  babyName: string = "";
  private _timeline: TimelineEvent[] = [];
  constructor() {
    this.generateFakeEvents();
  }

  generateFakeEvents() {
    for (let i = 0; i < 4; i++) {
      this.addRandomTimelineEvent();
    }
  }

  addTimelineEvent(newEvent: TimelineEvent) {
    this._timeline = [newEvent, ...this._timeline];
  }

  addRandomTimelineEvent() {
    const eventType =
      timelineEventTypes[Math.floor(Math.random() * timelineEventTypes.length)];
    this.addTimelineEvent({
      eventType: eventType,
      date: new Date()
    });
  }

  clearTimeline() {
    this._timeline.length = 0;
  }

  get timeline(): TimelineEvent[] {
    return this._timeline;
  }
}

export interface TimelineEvent {
  eventType: TimelineEventType;
  date: Date;
  comment?: string;
}

export interface TimelineEventType {
  name: string;
  title: string;
}

export const timelineEventTypes: TimelineEventType[] = [
  {
    name: "sleep",
    title: "hat geschlafen"
  },
  {
    name: "diaper",
    title: "hat in die Windel gemacht"
  },
  {
    name: "feed",
    title: "hat getrunken"
  },
  {
    name: "bath",
    title: "wurde gebaded"
  }
];
