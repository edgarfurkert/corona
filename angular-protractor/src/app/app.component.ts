import { Component, Optional, Inject } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Observable } from 'rxjs';

import { AUTH_ENABLED } from './app.tokens';
import { LoginService } from './services/login-service/login-service';
import { TaskService } from './services/task-service/task.service';
import { filter, map } from 'rxjs/operators';
import { Task } from './models/model-interfaces';

@Component({
  selector: 'ef-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  defaultTitle = 'title';

  numberInProgress: number;
  numberInProgress$: Observable<number>;

  constructor(@Optional() @Inject(AUTH_ENABLED) public authEnabled,
              public loginService: LoginService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private taskService: TaskService,
              private titleService: Title) {
  }

  ngOnInit(): void {
    this.defaultTitle = this.titleService.getTitle();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd))
      .subscribe(event => {
        this.setBrowserTitle();
      });

    this.numberInProgress$ = this.taskService.tasks$.pipe(
      map(tasks => tasks.filter(task => task.state === 'IN_PROGRESS').length)
    );

    this.taskService.tasks$.subscribe((tasks) => {
      this.numberInProgress = tasks.filter(
        (task: Task) => task.state === 'IN_PROGRESS').length;
    });

  }

  setBrowserTitle() {

    let title = this.defaultTitle;
    let route = this.activatedRoute;
    // firstChild gibt die Haupt-Kindroute der übergebenen Route zurück
    while (route.firstChild) {
      route = route.firstChild;
      title = route.snapshot.data['title'] || title;
    }
    this.titleService.setTitle(title);
  }

  logout() {
    this.loginService.logout();
    this.router.navigate(['login']);
    return false;
  }

}
