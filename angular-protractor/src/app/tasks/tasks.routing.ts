import {Routes} from '@angular/router';
import {TaskListComponent} from './task-list/task-list.component';
import {EditTaskComponent} from './edit-task/edit-task.component';
import {EditTaskGuard} from './edit-task/edit-task.guard';
import {TaskOverviewComponent} from './task-overview/task-overview.component';
import {TasksComponent} from './tasks.component';
import {LoginGuard} from '../login/login.guard';

export const tasksRoutes: Routes = [{
  path: '', component: TasksComponent,
  children: [
    {
      path: '',
      component: TaskListComponent
    },
    {
      path: 'edit/:id', component: EditTaskComponent,
      data: {title: 'Aufgabe bearbeiten'},
      canDeactivate: [EditTaskGuard]
    },
    {
      path: 'new', component: EditTaskComponent,
      data: {title: 'Neue Aufgabe anlegen'},
      canDeactivate: [EditTaskGuard]
    }
  ]
},
  {
    path: 'overview/:id',
    component: TaskOverviewComponent,
    outlet: 'right'
  }];

export const tasksRoutingComponents = [TasksComponent, TaskListComponent, EditTaskComponent, TaskOverviewComponent];