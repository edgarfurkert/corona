import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {Location} from '@angular/common';

import {FormControl} from '@angular/forms';
import {Task} from '../../models/model-interfaces';
import {TaskService} from '../../services/task.service';
import {Router, ActivatedRoute} from '@angular/router';
import { Observable, merge, Subscription } from 'rxjs';
import { debounceTime, map, tap, mergeMap, startWith, switchMap, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'ef-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {

  selectedTaskId: string | number = null;

  tasks$: Observable<Task[]>;

  searchTerm = new FormControl();

  taskChangedSubscription: Subscription;

  constructor(private taskService: TaskService,
              private route: ActivatedRoute,
              private router: Router,
              private location: Location) {
  }

  ngOnInit() {
    console.log('TaskList - ngOnInit');

    /*
    this.route.queryParams.subscribe((params) => {
      const query = decodeURI(params['query'] || '');
      this.searchTerm.setValue(query);
      this.tasks$ = this.taskService.findTasksAsync(query);
    });
    */

    // debounceTime: Ausgabe um 400ms verzögern
    // Version 1
    /*
    this.searchTerm.valueChanges.pipe(debounceTime(400)).subscribe((value) => {
      console.log('Search Term:', value);
      this.tasks$ = this.taskService.findTasksAsync(value);
    });
    */

    // Version 2
    // map: Observable von Observables zurückgeben
    // mergeMap: Observable zurückgeben
    // switchMap: Nur die letzte Anfrage weiterleiten
    // tap: Debugging
    /*
       Note: we used startWith because in Angular formControl.valueChanges does not start to emit 
             until the user manually changes it through UI controls, or imperatively through setValue 
             and combineLatest does not fire until all of the source Observables emit at least once; 
             so we make them all emit their default values once immediately.
    */
   /*
    this.tasks$ = this.searchTerm.valueChanges.pipe(debounceTime(400),
                                                    startWith(''),
                                                    //map(query => this.taskService.findTasksAsync(query)),
                                                    //mergeMap(query => this.taskService.findTasksAsync(query)),
                                                    switchMap(query => this.taskService.findTasksAsync(query)),
                                                    tap(tasks => console.log('Tasks:', tasks)));
    */

    // Version 3
    const paramsStream = this.route.queryParams.pipe(map(params => decodeURI(params['query'] || '')),
                                                     tap(query => console.log('paramsStream: query = ', query)),
                                                     tap(query => this.searchTerm.setValue(query)));
    
    const searchTermStream = this.searchTerm.valueChanges.pipe(debounceTime(400),
                                                               tap(query => console.log('searchTermStream: query = ', query)),
                                                               tap(query => this.adjustBrowserUrl(query)));

    this.tasks$ = merge(paramsStream, searchTermStream).pipe(distinctUntilChanged(),
                                                             switchMap(query => this.taskService.findTasksAsync(query)));

    console.log('TaskList: taskChangedSubscription');
    this.taskChangedSubscription = this.taskService.taskChanged$.subscribe(changedTask => {
      console.log('TaskList: taskChangedSubscription with changed task', changedTask);
      this.tasks$ = this.taskService.findTasksAsync(this.searchTerm.value);
    },
    error => {
      console.log('TaskList: taskChangedSubscription error', error);
    });
  }

  ngOnDestroy() {
    this.taskChangedSubscription.unsubscribe();
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
    this.tasks$ = this.taskService.findTasksAsync(queryString);
    this.adjustBrowserUrl(queryString);
  }

  adjustBrowserUrl(queryString = '') {
    const absoluteUrl = this.location.path().split('?')[0];
    const queryPart = queryString !== '' ? `query=${queryString}` : '';

    this.location.replaceState(absoluteUrl, queryPart);
  }

}
