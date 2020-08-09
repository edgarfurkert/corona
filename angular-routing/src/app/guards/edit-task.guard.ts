import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { EditTaskComponent } from '../tasks/edit-task/edit-task.component';

@Injectable({
  providedIn: 'root'
})
export class EditTaskGuard implements CanDeactivate<EditTaskComponent> {

  canDeactivate(component: EditTaskComponent,
                currentRoute: ActivatedRouteSnapshot,
                currentState: RouterStateSnapshot,
                nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    console.log('EditTaskGuard.canDeactivate');
    return component.canDeactivate();
  }
  
}
