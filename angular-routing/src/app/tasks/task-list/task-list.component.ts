import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';

import { Task } from '../../models/model-interfaces';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'ef-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {

  tasks: Task[];
  searchTerm = new FormControl(); 
  selectedTaskId: number;
  
  constructor(private taskService: TaskService,
              private route: ActivatedRoute,
              private router: Router,
              private location: Location) { }

  ngOnInit(): void {
    // Statisches Auslesen von Parametern über Snapshots per Query-Parameter
    // z.B. ...?query=Team
    const query = this.route.snapshot.queryParams['query'];
    if (query) {
      console.log('TaskList - snapshot query: ', query);
      this.searchTerm.setValue(query);
      this.tasks = this.taskService.findTasks(query);
      return;
    }

    // reaktives Auslesen von Parametern per Matrix-Parameter
    // z.B. ...;query=Team
    this.route.params.subscribe((params) => {
      const query = decodeURI(params['query'] || '');
      console.log('TaskList - subscribe params: ', query);
      this.searchTerm.setValue(query);
      this.tasks = this.taskService.findTasks(query);
    });

    // reaktives Auslesen von Parametern per Query-Parameter
    // z.B. ...?query=BACKLOG
    this.route.queryParams.subscribe((params) => {
      const query = decodeURI(params['query'] || '');
      console.log('TaskList - subscribe queryParams: ', query);
      this.searchTerm.setValue(query);
      this.tasks = this.taskService.findTasks(query);
    });

    // reaktives Auslesen von Fragmenten
    // z.B. ...#select=2
    this.route.fragment.subscribe(fragment => {
      if (!fragment) {
        return;
      }
      const [key, value] = fragment.split("=");
      if (key === 'select' && value !== undefined) {
        this.selectTask(Number(value));
      }
    });
  }

  selectTask(taskId: number) {
    console.log('TaskList - selectTask: ', taskId);
    this.selectedTaskId = taskId;

    this.router.navigate([{outlets: {'right': ['overview', taskId]}}], {relativeTo: this.route});
  }

  deleteTask(task) {
    console.log('TaskList - deleteTask: ', task);
    this.taskService.deleteTask(task);
    this.findTasks(this.searchTerm.value);
  }

  findTasks(queryString: string) {
    this.tasks = this.taskService.findTasks(queryString);
    console.log('TaskList - findTasks: ', this.tasks);
    this.adjustBrowserUrl(queryString);
  }

  adjustBrowserUrl(queryString = '') {
    const absoluteUrl = this.location.path().split('?')[0];
    const queryPart = queryString !== '' ? `query=${queryString}` : '';

    // change browser url and create a new entry in the browser history
    //this.location.go(absoluteUrl, queryPart);
    // change browser url and entry in the browser history
    this.location.replaceState(absoluteUrl, queryPart);
  }
}
