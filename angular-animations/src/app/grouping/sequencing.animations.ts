import {
  trigger,
  animate,
  style,
  transition,
  sequence
} from '@angular/animations';


export function growAndShrink(triggerName: string) {
  return trigger(triggerName, [
    transition(':enter', [
      sequence([
        animate('500ms ease-out', style({'transform': 'scale(2)'})),
        animate('500ms ease-in', style({'transform': 'scale(1)'})),
      ]),
    ])
  ]);
}
