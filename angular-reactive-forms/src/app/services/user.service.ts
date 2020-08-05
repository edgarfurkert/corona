import { Injectable } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  checkUserExists(name: string): Observable<boolean> {
    const exists = name == null || name.toLowerCase() !== 'johnny incognito';
    const t = timer(2000);
    return t.pipe(map(value => exists));
    //return of(exists);
  }
}
