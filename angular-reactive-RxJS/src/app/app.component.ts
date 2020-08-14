import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskService } from './services/task.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'ef-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-reactive-RxJS';

  numberInProgress$: Observable<number>;

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.numberInProgress$ = this.taskService.tasks$.pipe(
      map(tasks => tasks.filter(t => t.state === 'IN_PROGRESS').length)
    );
  }
}
