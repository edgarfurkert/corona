import {ViewChild, Component, OnInit, OnDestroy} from '@angular/core';
import {Title, Meta} from '@angular/platform-browser';
import {
  Router,
  ActivatedRoute,
} from '@angular/router';
import {Location} from '@angular/common';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';
import * as model from '../../shared/models/model-interfaces';
import {filter, map, mergeMap} from 'rxjs/operators';
import {createInitialTask, Task} from '../../shared/models/model-interfaces';
import {TaskService} from '../../shared/task-service/task.service';


@Component({
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css']
})
export class EditTaskComponent implements OnInit, OnDestroy {

  model = model;
  task: Task = createInitialTask();
  saved = false;

  @ViewChild(NgForm) form: NgForm;

  subscription: Subscription;

  constructor(
    private title: Title,
    private meta: Meta,
    private route: ActivatedRoute,
    private taskService: TaskService,
    private router: Router,

    private location: Location) {
  }

  ngOnInit() {
    this.subscription = this.route.params.pipe(
      map(params => params['id']),
      filter(id => id !== undefined),
      mergeMap(id => this.taskService.getTask(id)))
      .subscribe(task => {
        this.task = task;
        this.title.setTitle(task.title);
        this.meta.addTag({name: 'description', content: task.description});
        this.meta.addTag({name: 'twitter:title', content: task.title});
        this.meta.addTag({name: 'twitter:title', content: task.title});
        this.meta.addTag({name: 'twitter:description', content: task.description});
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  addTag() {
    this.task.tags.push({label: ''});
    return false;
  }

  removeTag(i: number) {
    this.task.tags.splice(i, 1);
    return false;
  }

  saveTask() {
    this.taskService.saveTask(this.task).subscribe(task => {
      this.saved = true;
      const relativeUrl = this.router.url.includes('edit') ? '../..' : '..';
      this.router.navigate([relativeUrl], {relativeTo: this.route});
    });
  }

  cancel() {
    const relativeUrl = this.router.url.includes('edit') ? '../..' : '..';
    this.router.navigate([relativeUrl], {relativeTo: this.route});

    return false;
  }

  canDeactivate(): boolean {
    if (this.saved || !this.form.dirty) {
      return true;
    }
    return window.confirm(`Ihr Formular besitzt ungespeicherte Änderungen, möchten Sie die Seite wirklich verlassen?`);
  }

}
