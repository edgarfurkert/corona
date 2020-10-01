import { Component } from '@angular/core';
import { FormGroup, FormArray, FormControl, FormBuilder, Validators } from '@angular/forms';
import { map } from 'rxjs/operators';

import { Task, createInitialTask } from '../models/model-interfaces';
import * as model from '../models/model-interfaces';
import { ifNotBacklogThenAssignee, emailValidator, UserExistsValidatorDirective } from '../models/app-validators';
import { TaskService } from '../services/task.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'ef-reactive-form',
  templateUrl: './reactive-form.component.html'
})
export class ReactiveFormComponent {

  model = model;
  task: Task = createInitialTask();

  taskForm: FormGroup;
  taskForm2: FormGroup;
  tagsArray: FormArray;

  constructor(private taskService: TaskService,
              private userService: UserService,
              fb: FormBuilder) {
    this.taskForm = fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', Validators.maxLength(2000)],
      favorite: [false],
      state: ['BACKLOG'],
      tags: fb.array([
        this.createTagControl()
      ]),
      assignee: fb.group({
        name: ['', null, this.userExistsValidatorReused],
        email: ['', emailValidator],
      })
    }, { validator: ifNotBacklogThenAssignee });

    this.taskForm = new FormGroup(this.taskForm.controls, {
      validators: this.taskForm.validator,
      updateOn: 'blur'
    }); // Workaround für das Setzen der updateOn-Option


    this.taskForm.valueChanges.subscribe((value) => {
      Object.assign(this.task, value);
    });

    this.tagsArray = <FormArray>this.taskForm.controls['tags'];


    this.taskForm2 = new FormGroup({
      title: new FormControl('', { validators: Validators.required }),
      description: new FormControl(''),
      favorite: new FormControl(false),
      state: new FormControl('BACKLOG'),
      tags: new FormArray([
        new FormGroup({
          label: new FormControl('')
        })
      ]),
      assignee: new FormGroup({
        name: new FormControl('', {
          asyncValidators: this.userExistsValidatorReused,
          updateOn: 'blur'
        }),
        email: new FormControl('', {
          validators: emailValidator
        })
      }),
    }, { validators: ifNotBacklogThenAssignee, /* updateOn: 'submit' */ });
  }

  private createTagControl(): FormGroup {
    return new FormGroup({
      label: new FormControl('', Validators.minLength(3))
    });
  }

  addTag() {
    this.tagsArray.push(this.createTagControl());
    return false;
  }

  removeTag(i: number) {
    this.tagsArray.removeAt(i);
    return false;
  }

  saveTask(value: any) {
    console.log(value);
    Object.assign(this.task, value);
    this.taskService.saveTask(this.task);
  }

  loadTask(id: number) {
    const task = this.taskService.getTask(id);
    this.adjustTagsArray(task.tags);
    this.taskForm.patchValue(task);
    this.task = task;
    return false;
  }

  private adjustTagsArray(tags: any[]) {
    const tagCount = tags ? tags.length : 0;
    while (tagCount > this.tagsArray.controls.length) {
      this.addTag();
    }
    while (tagCount < this.tagsArray.controls.length) {
      this.removeTag(0);
    }
  }

  userExistsValidator = (control) => {
    return this.userService.checkUserExists(control.value).pipe(
      map(checkResult => {
        return (checkResult === false) ? { userNotFound: true } : null;
      }));
  }

  userExistsValidatorReused = (control) => {
    const validator = new UserExistsValidatorDirective(this.userService);
    return validator.validate(control);
  }

}



