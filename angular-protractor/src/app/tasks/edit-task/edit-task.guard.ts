import { Injectable }    from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot, CanDeactivate} from '@angular/router';
import { Observable }    from 'rxjs';
import {EditTaskComponent} from "./edit-task.component";

@Injectable({
  providedIn: 'root'
})
export class EditTaskGuard implements CanDeactivate<EditTaskComponent>{

  canDeactivate(component: EditTaskComponent,
                route: ActivatedRouteSnapshot,
                router: RouterStateSnapshot)
                                       : Observable<boolean> | boolean {
    return component.canDeactivate();
  }
}
