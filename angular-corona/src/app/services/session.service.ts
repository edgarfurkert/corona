import { Injectable, Inject } from '@angular/core';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { SERVICE_LOG_ENABLED } from '../app.tokens';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(@Inject(SERVICE_LOG_ENABLED) private log: boolean, @Inject(SESSION_STORAGE) private storage: StorageService) {
  }

  set(key:string, value:Object) {
    if (this.log) {
      console.log('SessionService: set', key, '=', value);
    }
    this.storage.set(key, value);
    if (this.log) {
      console.log('SessionService: storage', this.storage);
    }
  }

  get(key:string): Object {
    return this.storage.get(key);
  }
}
