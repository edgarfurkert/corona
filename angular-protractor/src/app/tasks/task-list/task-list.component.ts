import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';

import {FormControl} from '@angular/forms';
import {Task} from '../../models/model-interfaces';
import {TaskService} from '../../services/task-service/task.service';
import {Router, ActivatedRoute} from '@angular/router';
import {merge, Observable} from 'rxjs';
import {debounceTime, tap, switchMap} from 'rxjs/operators';
import {distinctUntilChanged, map, mergeMap} from 'rxjs/internal/operators';

@Component({
  selector: 'task-list',
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
              private location: Location) {
  }

  ngOnInit() {

    this.tasks$ = this.searchTerm.valueChanges.pipe(
      debounceTime(400),
      mergeMap(query => this.taskService.findTasks(query)),
      tap(tasks => console.log('Tasks:', tasks)));


    this.tasks$ = this.taskService.tasks$;

    const paramsStream = this.route.queryParams
      .pipe(
        map(params => decodeURI(params['query'] || '')),
        tap(query => this.searchTerm.setValue(query)));

    const searchTermStream = this.searchTerm.valueChanges.pipe(
      debounceTime(400),
      tap(query => this.adjustBrowserUrl(query)));

    merge(paramsStream, searchTermStream).pipe(
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
