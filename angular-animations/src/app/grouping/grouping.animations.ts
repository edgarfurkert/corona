import {
  trigger,
  animate,
  style,
  transition,
  sequence,
  group,
  state
} from '@angular/animations';


export function zoomInOut(triggerName: string) {
  return trigger(triggerName, [
    transition(':enter', [
      style({opacity: 0, transform: 'scaleX(0)'}),
      group([
        animate('0.3s ease-in', style({transform: 'scaleX(1)'})),
        animate('1s ease', style({opacity: 1}))
      ])
    ]),
    transition(':leave', [
      group([
        animate('0.3s ease-out', style({transform: 'scaleX(0)'})),
        animate('1s ease', style({opacity: 0}))
      ])
    ])
  ]);
}

export function growShrinkFade(triggerName: string) {
  return trigger(triggerName, [
    state('in', style({'background-color': 'green', 'opacity': 0})),
    transition(':enter', [
      style({'background-color': 'green', 'opacity': 0}),
      sequence([
        group([
          sequence([
            animate('500ms ease-out', style({'transform': 'scale(2)'})),
            animate('500ms ease-in', style({'transform': 'scale(1)'}))
          ]),
          sequence([
            animate('1s', style({'opacity': 1})),
            animate('2s ease-out', style({'background-color': 'red'}))
          ])
        ]),
        animate('500ms', style({'opacity': 0}))
      ])
    ])
  ]);
}