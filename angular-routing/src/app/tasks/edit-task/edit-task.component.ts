import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { Subscription, Observable } from 'rxjs';

import { Task, createInitialTask } from '../../models/model-interfaces';
import * as model from '../../models/model-interfaces';
import { TaskService } from '../../services/task.service';
import { HttpClient, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'ef-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css']
})
export class EditTaskComponent implements OnInit {

  model = model;

  task: Task = createInitialTask();

  saved = false;

  @ViewChild(NgForm, {static: true}) form: NgForm;

  subscription: Subscription;

  constructor(private route: ActivatedRoute,
              private taskService: TaskService,
              private router: Router,
              private titleService: Title,
              private location: Location,
              private http: HttpClient) { }

  ngOnInit(): void {
    // statisch auf Parameterwerte zugreifen
    const id = this.route.snapshot.params['id'];
    console.log('id: ', id);
    //this.task = id ? this.taskService.getTask(id) : createInitialTask();

    // reactive auf Parameterwerte zugreifen
    this.subscription = this.route.params.subscribe(params => {
        console.log('params: ', params)
        const id = (params['id'] || '');
        //this.task = id ? this.taskService.getTask(id) : createInitialTask();
        if (!id) {
          this.task = createInitialTask();
        } else {
          this.taskService.getTaskByHttp(id).subscribe(task => {
            console.log('Task gelesen', task);
            this.task = task;
          })
        }
      });
    
    console.log(this.form);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  addTag() {
    this.task.tags = this.task.tags || [];
    this.task.tags.push({label: ''});
    return false;
  }

  removeTag(i: number) {
    this.task.tags.splice(i, 1);
    return false;
  }

  saveTask() {
    /* 
    // Version 1
    if (!this.task.id) {
      // create task
      this.taskService.createTaskLong(this.task).subscribe(task => {
        console.log('saveTask: Aufgabe erfolgreich gespeichert', task)
        this.task = task;
      });
    } else {
      // update task
      this.taskService.updateTask(this.task).subscribe(task => {
        console.log('saveTask: Aufgabe erfolgreich aktualisiert', task)
        this.task = task;
      });
    }
    */

    // Version 2
    const result = this.task.id ? this.taskService.updateTaskByHttp(this.task)
                                : this.taskService.createTaskByHttp(this.task);
    result.subscribe(task => {
      console.log('saveTask: Aufgabe erfolgreich gespeichert', task)
      this.task = task;
    });

    // Version 3
    this.taskService.saveTaskByHttp(this.task).subscribe(task => {
      console.log('saveTask: Aufgabe erfolgreich per HTTP gespeichert', task)
      this.task = task;
    });

    this.task = this.taskService.saveTask(this.task);
    // navigate by absolute path
    //this.router.navigate(['/tasks']);

    // navigate by relative path
    const relativeUrl = this.router.url.includes('edit') ? '../..' : '..';
    this.router.navigate([relativeUrl], {relativeTo: this.route});

    this.saved = true;
    /*
    const url = this.router.parseUrl(this.router.url);
    console.log(url);
    */
  //  this.router.navigateByUrl(url);
  }

  cancel() {
    // navigate by absolute path
    //this.router.navigate(['/tasks']);

    this.location.back();
    return false;
  }

  canDeactivate(): boolean {
    console.log('EditTaskComponent.canDeactivate');
    console.log('EditTaskComponent: saved = ', this.saved);
    console.log('EditTaskComponent: form.dirty = ', this.form.dirty);

    if (this.saved || !this.form.dirty) {
      return true;
    }
    return window.confirm(`Ihr Formular besitzt ungespeicherte Änderungen, möchten Sie die Seite wirklich verlassen?`);
  }

}
