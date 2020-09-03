import { Injectable } from '@angular/core';
import {Subject} from 'rxjs/internal/Subject';
import {Observable} from 'rxjs/internal/Observable';
import {AnimationEvent} from '@angular/animations';

@Injectable({
  providedIn: 'root'
})
export class RouterAnimationEventsService {

    private animationEvents$ = new Subject<AnimationEvent>();

    dispatchEvent(event: AnimationEvent) {
      console.log('RouterAnimationEventsService: dispatchEvent', event);
      this.animationEvents$.next(event);
    }

    listenForEvents(): Observable<AnimationEvent> {
      return this.animationEvents$.asObservable();
    }
}
