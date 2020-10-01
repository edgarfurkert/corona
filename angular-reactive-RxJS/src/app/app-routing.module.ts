import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { taskRoutes } from './tasks/task.routing';

const routes: Routes = [
  { path: 'tasks', children: taskRoutes }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
