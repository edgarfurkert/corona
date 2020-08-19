
import {Observable, of} from 'rxjs';
import {delay} from 'rxjs/operators';
import {Injectable} from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  checkUserExists(name: string): Observable<boolean> {
    const result = name == null || name.toLowerCase() !== 'johnny incognito';
    return of(result).pipe(delay(250));
  }
}
