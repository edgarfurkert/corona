import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';

import {FormControl} from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';
import {merge, Observable} from 'rxjs';
import {debounceTime, tap, switchMap} from 'rxjs/operators';
import {distinctUntilChanged, map} from 'rxjs/internal/operators';
import {TaskService} from '../../shared/task-service/task.service';
import {Task} from '../../shared/models/model-interfaces';
import {AbstractCacheService} from '../../shared/cache/abstract-cache.service';

@Component({
  selector: 'ch-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {

  selectedTaskId: string | number = null;

  tasks$: Observable<Task[]>;

  searchTerm = new FormControl();

  constructor(private taskService: TaskService,
              private router: Router,
              private route: ActivatedRoute,
              private cacheService: AbstractCacheService,
              private location: Location) {
                console.log('NEW TASKLIST')
  }

  ngOnInit() {

    console.log(this.cacheService.get('ANSWER'));

    this.tasks$ = this.taskService.tasks$;

    const paramsStream = this.route.queryParams
      .pipe(
        map(params => decodeURI(params['query'] || '')),
        tap(query => this.searchTerm.setValue(query)));

    const searchTermStream = this.searchTerm.valueChanges.pipe(
      debounceTime(400),
      tap(query => this.adjustBrowserUrl(query))
    );

    merge(paramsStream, searchTermStream)
      .pipe(
        distinctUntilChanged(),
        switchMap(query =>  this.taskService.findTasks(query)))
      .subscribe();
  }


  deleteTask(task) {
    this.taskService.deleteTask(task).subscribe();
  }

  selectTask(taskId: string | number) {
    this.selectedTaskId = taskId;
    this.router.navigate([ {outlets: {'right': [ 'overview' , taskId]}}], {relativeTo: this.route});
  }

  findTasks(queryString: string) {
    // jetzt über type-ahead gelöst
    // this.tasks$ = this.taskService.findTasks(queryString);
    // this.adjustBrowserUrl(queryString);
  }

  adjustBrowserUrl(queryString = '') {
    const absoluteUrl = this.location.path().split('?')[0];
    const queryPart = queryString !== '' ? `query=${queryString}` : '';

    this.location.replaceState(absoluteUrl, queryPart);
  }

}
