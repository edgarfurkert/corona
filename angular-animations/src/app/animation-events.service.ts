import { Injectable } from '@angular/core';
import {Subject} from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root'
})
export class AnimationEventsService {

  private animationEvents$ = new Subject();

  constructor() { }


}
