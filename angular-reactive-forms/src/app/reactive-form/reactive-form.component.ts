import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import {Task, createInitialTask} from '../models/model-interfaces';
import * as model from '../models/model-interfaces';
import { TaskService } from '../services/task.service';
import { UserService } from '../services/user.service';
import { emailValidator, UserExistsValidatorDirective, ifNotBacklogThanAssignee } from '../models/app-validators'
import { map } from 'rxjs/operators';

@Component({
  selector: 'ef-reactive-form',
  templateUrl: './reactive-form.component.html',
  styleUrls: ['./reactive-form.component.css']
})
export class ReactiveFormComponent implements OnInit {

  model = model;
  taskForm: FormGroup;
  tagsArray: FormArray;
  task: Task = createInitialTask();

  constructor(private taskService: TaskService, private userService: UserService, fb: FormBuilder) { 
    /* 
    // Version 1
    this.taskForm = new FormGroup({
      title: new FormControl(''),
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
          asyncValidators: this.userExistsValidator,
          updateOn: 'blur'
        }),
        email: new FormControl('')
      }, { validators: ifNotBacklogThanAssignee, updateOn: 'submit' })
    });
    */

    // Version 2
    this.taskForm = fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', Validators.maxLength(2000)],
      favorite: [false],
      state: ['BACKLOG'],
      tags: fb.array([
        fb.group({
          label: ['', Validators.minLength(3)]
        })
      ]),
      assignee: fb.group({
        // 1. parameter: value
        // 2. parameter: sync validator
        // 3. parameter: async validator
        //name: ['', null, this.userExistsValidator],
        name: ['', { asyncValidators: this.userExistsValidator, updateOn: 'blur' }],
        email: ['', emailValidator]
      })
    }, { validators: ifNotBacklogThanAssignee, updateOn: 'blur' });
  //}, { validators: ifNotBacklogThanAssignee, updateOn: 'submit' });
  //}, { asyncValidators: someAsyncValidator });

    this.tagsArray = <FormArray>this.taskForm.controls['tags'];

    this.taskForm.valueChanges.subscribe((value) => {
      console.log('form-valueChanges: ' + value);
    });
    this.taskForm.get('title').valueChanges.subscribe((value) => {
      console.log('title-valueChanges: ' + value);
    });
  }

  ngOnInit(): void {
  }

  saveTask(value: any) {
    console.log(value);
    Object.assign(this.task, value);
    this.taskService.saveTask(this.task);
  }

  private createTagControl(): FormGroup {
    return new FormGroup({
      label: new FormControl('')
    });
  }

  addTag() {
    this.tagsArray.push(this.createTagControl());
    return false; // do not submit the form
  }

  removeTag(i: number) {
    this.tagsArray.removeAt(i);
    return false; // do not submit the form
  }

  loadTask(id: number) {
    this.task = this.taskService.getTask(id);
    this.adjustTagsArray(this.task.tags);
    this.taskForm.patchValue(this.task);
    return false; // do not submit the form
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

  /**
   * Define the member variable 'userExistsValidator'
   * referring to an anonymous function with an AbstractControl object.
   * 
   * @param control
   * @returns validation error structure or null 
   */
  userExistsValidator = (control: AbstractControl) => {
    /*
    // Version 1
    return this.userService.checkUserExists(control.value).pipe(
      map(checkResult => {
        return (checkResult === false) ? {userNotFound: true} : null;
      })
    )
    */

    // Version 2
    const validator = new UserExistsValidatorDirective(this.userService);
    return validator.validate(control);
  }
}

