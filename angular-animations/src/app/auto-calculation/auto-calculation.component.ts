import {Component, ViewChild} from '@angular/core';
import {PanelComponent} from '../panel/panel.component';
import {RouterAnimationEventsService} from '../router-animation-events.service';
import {filter} from 'rxjs/operators';

@Component({
  templateUrl: './auto-calculation.component.html',
  styleUrls: ['./auto-calculation.component.css']
})
export class AutoCalculationComponent {

  @ViewChild(PanelComponent) firstPanel: PanelComponent;

constructor(private routerAnimationEventsService: RouterAnimationEventsService) {
  this.routerAnimationEventsService.listenForEvents()
      .pipe( filter(event => event.phaseName === 'done'))
      .subscribe(event => {
          console.log('AutoCalculation: open first panel');
          this.firstPanel.open = true;
  });
}
/*
  @HostListener('@routingAnimation.done', ['$event']) onDone(event) {
    if (event.fromState === 'void') {
      this.firstPanel.open = true;
      this.changeDetector.detectChanges();
    }
  }
  */
}
