import {
  trigger,
  animate,
  style,
  transition,
  keyframes, query, group
} from '@angular/animations';

export function animateRoute2(name) {
  return trigger(name, [
    transition(':enter', [
      //  style({opacity: 1}),
      animate('2.2s ease-in', keyframes([
        style({transform: 'translateX(-5%)', offset: 0}),
        style({transform: 'translateX(2%)', offset: 0.85}),
        style({transform: 'translateX(0%)', offset: 1})
      ]))
    ]),
    // transition(':leave', [
    //   style({opacity: 1}),
    //    animate('0.1s ease-out')
    //  ])
  ]);
}

