import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription, timer, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'ef-rx-demo',
  templateUrl: './rx-demo.component.html',
  styleUrls: ['./rx-demo.component.css']
})
export class RxDemoComponent implements OnInit, OnDestroy {

  @Input() disabled: boolean = false; 

  dateSubscription: Subscription;
  currentDate: Date;
  
  currentTime$: Observable<Date>;

  randomValues$: Observable<any>;

  randomValuesSub: Subscription;
  randomValue: number;

  sub1: Subscription;
  sub2: Subscription;

  randomValuesSubject: Subject<any>;

  sub3: Subscription;
  sub4: Subscription;

  constructor() { }

  ngOnInit(): void {
    console.log('RxDemo - ngOnInit');
    if (this.disabled) {
      console.log('RxDemo - disabled: ', this.disabled);
      return;
    };

    this.dateSubscription = timer(0, 1000).pipe(map(() => new Date())).subscribe(value => {
      this.currentDate = value;
    });

    this.currentTime$ = timer(0, 1000).pipe(map(() => new Date()));

    this.randomValues$ = Observable.create((observer) => {
      const interval = setInterval(() => {
        observer.next(Math.random());
      }, 1000);
      return () => {
        console.log('RxDemo: clearInterval')
        clearInterval(interval);
      }
    });

    this.sub1 = this.randomValues$.subscribe((value) => {
      console.log(`Subscription 1: ${value}`);
    });

    this.sub2 = this.randomValues$.subscribe((value) => {
      console.log(`Subscription 2: ${value}`);
    });

    // Subjects bieten Ihnen die komfortable Möglichkeit, Daten an mehrere
    // interessierte Subscriber zu verteilen!
    this.randomValuesSubject = new Subject();
    const interval = setInterval(() => {
      this.randomValuesSubject.next(Math.random());
    }, 1000);

    this.sub3 = this.randomValuesSubject.subscribe((value) => {
      console.log(`Subscription 3: ${value}`);
    });

    this.sub4 = this.randomValuesSubject.subscribe((value) => {
      console.log(`Subscription 4: ${value}`);
    });

    this.startRandomValuesObservable();
  }

  private startRandomValuesObservable() {
    this.randomValuesSub = this.randomValues$.subscribe((value) => {
      this.randomValue = value;
    });
  }

  private stopRandomValuesObservable() {
    this.randomValuesSub.unsubscribe();
  }

  ngOnDestroy() {
    console.log('RxDemo - ngOnDestroy')
    this.dateSubscription.unsubscribe();
    this.stopRandomValuesObservable();
  }
}
