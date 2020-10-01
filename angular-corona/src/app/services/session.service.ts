import { Injectable, Inject } from '@angular/core';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { NGXLogger } from 'ngx-logger';

import { SERVICE_LOG_ENABLED } from '../app.tokens';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(@Inject(SERVICE_LOG_ENABLED) private log: boolean, 
              private logger: NGXLogger, 
              @Inject(SESSION_STORAGE) private storage: StorageService) {
  }

  set(key:string, value:any) {
    if (this.log) {
      this.logger.debug('SessionService: set', key, '=', value);
    }
    this.storage.set(key, value);
    if (this.log) {
      this.logger.debug('SessionService: storage', key, '=', this.storage.get(key));
    }
  }

  get(key:string): any {
    if (this.log) {
      this.logger.debug('SessionService: get', key, '=', this.storage.get(key));
    }
    return this.storage.get(key);
  }
}
