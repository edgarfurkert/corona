import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';

import { Task, createInitialTask } from '../../models/model-interfaces';
import * as model from '../../models/model-interfaces';
import { TaskService } from '../../services/task.service';

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
              private location: Location) { }

  ngOnInit(): void {
    // statisch auf Parameterwerte zugreifen
    const id = this.route.snapshot.params['id'];
    console.log('id: ', id);
    //this.task = id ? this.taskService.getTask(id) : createInitialTask();

    // reactive auf Parameterwerte zugreifen
    this.subscription = this.route.params.subscribe(params => {
        console.log('params: ', params)
        const id = (params['id'] || '');
        this.task = id ? this.taskService.getTask(id) : createInitialTask();
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
