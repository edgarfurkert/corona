import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Observable, Subscription, merge } from 'rxjs';
import { debounceTime, map, tap, distinctUntilChanged } from 'rxjs/operators';


import { TaskService } from '../../services/task.service';
import { Task } from '../../models/model-interfaces';

@Component({
  selector: 'ef-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {

  selectedTaskId: string | number = null;

  tasks$: Observable<Task[]>;

  searchTerm = new FormControl();

  constructor(private taskService: TaskService,
              private route: ActivatedRoute,
              private router: Router,
              private location: Location) {
  }

  ngOnInit() {
    console.log('TaskList - ngOnInit');

    this.tasks$ = this.taskService.tasks$;                                               

    const paramsStream = this.route.queryParams.pipe(map(params => decodeURI(params['query'] || '')),
                                                     tap(query => console.log('paramsStream: query = ', query)),
                                                     tap(query => this.searchTerm.setValue(query)));
    
    const searchTermStream = this.searchTerm.valueChanges.pipe(debounceTime(400),
                                                               tap(query => console.log('searchTermStream: query = ', query)),
                                                               tap(query => this.adjustBrowserUrl(query)));

    merge(paramsStream, searchTermStream).pipe(distinctUntilChanged(),
                                               tap(query => this.taskService.findTasks(query))).subscribe();

  }

  deleteTask(task) {
    this.taskService.deleteTask(task);
    this.findTasks(this.searchTerm.value);
  }

  selectTask(taskId: string) {
    this.selectedTaskId = taskId;

    this.router.navigate([ {outlets: {'right': [ 'overview' , taskId ]}} ], {
      relativeTo: this.route
    });
  }

  findTasks(queryString: string) {
    this.tasks$ = this.taskService.findTasks(queryString);
    this.adjustBrowserUrl(queryString);
  }

  adjustBrowserUrl(queryString = '') {
    const absoluteUrl = this.location.path().split('?')[0];
    const queryPart = queryString !== '' ? `query=${queryString}` : '';

    this.location.replaceState(absoluteUrl, queryPart);
  }

}
