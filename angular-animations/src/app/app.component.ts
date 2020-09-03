import { Component } from '@angular/core';
import { trigger, transition, group, query, style, animate } from '@angular/animations';
import { AnimationEvent } from '@angular/animations';

import { RouterAnimationEventsService } from './router-animation-events.service';

@Component({
  selector: 'ef-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('routingAnimation', [
      transition('* => *', [
        group([
          query(':enter', [
            style({ transform: 'translateX(-100%)' }),
            animate('1.4s ease-in', style({ transform: 'translateX(0%)' }))
          ],
            { optional: true }
          ),
          query(':leave', [
            style({ transform: 'translateX(0)' }),
            animate('1.4s ease-out', style({ transform: 'translateX(100%)' }))
          ],
            { optional: true }
          )])
      ])
    ])
  ]
})
export class AppComponent {
  title = 'angular-animations';

  constructor(private routerAnimationEventsService: RouterAnimationEventsService) {
  }

  animationDone(event: AnimationEvent) {
    console.log('App: animationDone', event);
    this.routerAnimationEventsService.dispatchEvent(event);
  }
}
