import {Component, OnDestroy, OnInit} from '@angular/core';
import {
  Observable, Observer, Subscriber, Subscription, Subject, BehaviorSubject, interval, fromEvent,
  timer, merge, range, from, of
} from 'rxjs';
import {
  bufferCount, bufferTime, delay, filter, map, mergeMap, retry, retryWhen, take,
  tap
} from 'rxjs/operators';

@Component({
  templateUrl: 'rxdemo.component.html',
  styleUrls: ['rxdemo.component.css'],
})
export class RxDemoComponent implements OnInit, OnDestroy {

  outputFirstObservable: any[] = [];

  observableRangeOutput: any[] = [];

  intervalOutput: any[] = [];
  filteredIntervalOutput: any[] = [];
  bufferedIntervalOutput: any[] = [];

  rangeObservable: Observable<number>;

  behaviorSubject = new BehaviorSubject('initial');
  behaviorSubjectOutput = [];

  bufferedCountOutput: any[] = [];
  subscription: Subscription;
  endlessCounter = 0;

  // Subjects:
  subject = new Subject();
  subjectOutput = [];

  constructor() {

    // Erfolgreiches observable
    const observable = Observable.create((observer: Observer<number>) => {
      observer.next(1);
      observer.next(2);
      observer.next(3);
      observer.complete();
    });

    observable.subscribe(
      (value) => {
        console.log('new value: ', value);
      },
      (error) => {
        console.log('error: ', error);
      },
      () => {
        console.log('completed successfully');
      }
    );

    console.log('----- Observable mit zufälligem Fehler ----');

    const observableWithRandomError = Observable.create((observer) => {
      observer.next(1);
      observer.next(2);
      if (Math.random() > 0.3) {
        observer.error('something went wrong!');
      }
      observer.next(3);
      observer.complete();
    }).pipe(retry(5));

    observableWithRandomError.subscribe(
      (value) => {
        console.log('new value: ', value);
      },
      (error) => {
        console.log('error: ', error);
      },
      () => {
        console.log('completed successfully');
      }
    );

    console.log('----- Verzögertes Retry ----');

    const observableDelayedRetry = Observable.create((observer) => {
      observer.next(1);
      observer.next(2);
      if (Math.random() > 0.3) {
        observer.error('something went wrong!');
      }
      observer.next(3);
      observer.complete();
    }).pipe(retryWhen((error) => {
      return error.pipe(delay(1000));
    }));

    observableDelayedRetry.subscribe(
      (value) => {
        console.log('new value: ', value);
      },
      (error) => {
        console.log('error: ', error);
      },
      () => {
        console.log('completed successfully');
      }
    );

    console.log('----- 3 mal verzögertes Retry ----');

    const obsIncrementalRetry = Observable.create((observer) => {
      observer.next(1);
      observer.next(2);
      if (Math.random() > 0.02) {
        observer.error('something went wrong!');
      }
      observer.next(3);
      observer.complete();
    }).pipe(retryWhen((errors) => {
      return errors.pipe(mergeMap((error, index) => {
        if (index >= 5) {
          throw error;
        }
        console.log('Neuer Versuch in ' + index + ' Sekunden');
        return of(error).pipe(delay(index * 1000));
      }));
    }));


    obsIncrementalRetry.subscribe(
      (value) => {
        console.log('new value: ', value);
      },
      (error) => {
        console.log('error: ', error);
      },
      () => {
        console.log('completed successfully');
      }
    );

    // OBSERVABLES ERZEUGEN

    const observableOf = of(1, 2, 3);

    const promise = new Promise((resolve) => {
      setTimeout(() => {
        resolve('resolved value');
      }, 100);
    });

    from(promise).subscribe(value => {
      console.log(value); // resolved value
    });

    range(1, 3).subscribe(this.createOutputSubscriber(this.observableRangeOutput));


    merge(
      range(1, 2),
      range(5, 2)
    ).subscribe((value) => console.log('merged: ', value));


    // Operatoren

    const squareValues = range(1, 5).pipe(
      tap(value => console.log('Ursprungswert: ', value)),
      map(value => value * value))
      .subscribe(result => console.log('Quadratwert: ', result));

    range(1, 10).pipe(
      filter(value => value % 2 === 0)
    );


    const subject1 = new Subject();
    subject1.subscribe(value => {
      console.log(`subscriber1: ${value}`);
    });
    subject1.subscribe(value => {
      console.log(`subscriber2: ${value}`);
    });

    subject1.next('value1');
    subject1.next('value2');

    const subject = new BehaviorSubject('initial');
    subject.subscribe(value => {
      console.log(`subscriber1: ${value}`);
    });
    subject.next('value1');
    subject.next('value2');

    console.log('subscribing second subscriber');
    subject.subscribe(value => {
      console.log(`subscriber2: ${value}`);
    });
    subject.next('value3');
  }

  randomValues = Observable.create((observer) => {
    const int = setInterval(() => {
      observer.next(Math.random());
    }, 1000);

    return () => {
      console.log('clearing interval');
      clearInterval(int);
    };
  });


  dateSubscription: Subscription;
  currentDate: Date;
  currentTime$: Observable<Date>;
  randomValuesSub: Subscription;
  randomValue: number;


  sub1: Subscription;
  sub2: Subscription;

  ngOnInit() {
    this.currentTime$ = timer(0, 1000).pipe(map(() => new Date()));

    this.dateSubscription = timer(0, 1000)
      .pipe(map(() => new Date()))
      .subscribe(value => {
        this.currentDate = value;
      });

    this.sub1 = this.randomValues.subscribe((value) => {
      console.log(`Subscription 1: ${value}`);
    });

    this.sub2 = this.randomValues.subscribe((value) => {
      console.log(`Subscription 2: ${value}`);
    });

    const square = document.getElementById('square');
    fromEvent(square, '')
      .subscribe((e: any) => {
        console.log(`X: ${e.x},Y: ${e.y}`);
      });
  }

  ngOnDestroy() {
    this.dateSubscription.unsubscribe();
  }

  createOutputSubscriber(output) {
    return Subscriber.create((value) => {
        output.push(`new value: ${value}`);
      },
      (error) => {
        output.push(`error: ${error}`);
      },
      () => {
        output.push('completed successfully');
      });
  }

  startIntervalObservable() {
    this.intervalOutput = [];
    //  timer(1000, 200).;

    interval(250).pipe(take(5)).subscribe(
      this.createOutputSubscriber(this.intervalOutput)
    );
  }

  startFilteredIntervalObservable() {
    this.filteredIntervalOutput = [];
    interval(250).pipe(
      take(10),
      filter(value => value % 2 === 0))
      .subscribe(
        this.createOutputSubscriber(this.filteredIntervalOutput)
      );
  }

  startBufferedIntervalObservable() {
    this.bufferedIntervalOutput = [];
    interval(250).pipe(
      bufferTime(1000),
      take(5))
      .subscribe(
        this.createOutputSubscriber(this.bufferedIntervalOutput)
      );
  }


  startBufferedCountObservable() {
    this.bufferedCountOutput = [];
    interval(250).pipe(
      bufferCount(4),
      take(5))
      .subscribe(
        this.createOutputSubscriber(this.bufferedCountOutput)
      );
  }


  startEndlessObservable() {
    this.subscription = interval(100)
      .subscribe(
        value => {
          this.endlessCounter = value;
        },
        error => {
          console.log(error);
        },
        () => {
          console.log('observable ended');
        });
  }

  stopEndlessObservable() {
    this.subscription.unsubscribe();
  }

  startRandomValuesObservable() {
    this.randomValuesSub = this.randomValues.subscribe((value) => {
      this.randomValue = value;
    });
  }

  stopRandomValuesObservable() {
    this.randomValuesSub.unsubscribe(); // clearing interval
  }

  emitViaSubject(value: any) {
    // sende Wert an alle Subscriber
    this.subject.next(value);
  }

  registerTwoSubscribers() {
    this.subject.subscribe(value => {
      this.subjectOutput.push(`subscriber1 ${value}`);
    });
    this.subject.subscribe(value => {
      this.subjectOutput.push(`subscriber2 ${value}`);
    });
  }

  emitViaBehaviorSubject(value: any) {
    // sende Wert an alle Subscriber
    this.behaviorSubject.next(value);
  }

  registerNewSubscriber(name: string) {
    this.behaviorSubject.subscribe(value => {
      this.behaviorSubjectOutput.push(`${name}: ${value}`);
    });
  }


}
