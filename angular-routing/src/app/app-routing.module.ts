import { NgModule, InjectionToken } from '@angular/core';
import { Routes, RouterModule, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { taskRoutes1, taskRoutes2, tasksRoutingComponents } from './tasks/task.routing';
import { SettingsComponent } from './settings/settings.component';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ChatComponent } from './chat/chat.component';

import { LoginGuard } from './guards/login.guard';
import { UserResolver } from './login/user-resolver';
import { TaskOverviewComponent } from './task-overview/task-overview.component';

const RESOLVED_TOKEN = new InjectionToken<string>('RESOLVED_TOKEN');

export const appRoutes: Routes = [
  // usage of dynamic path meta data by UserResolver
  { path: 'dashboard', component: DashboardComponent, resolve: { user: UserResolver } },
  // redirect only if the path is exact ''
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'settings', component: SettingsComponent, data: {title: 'Einstellungen'}, resolve: { user: UserResolver, token: RESOLVED_TOKEN } },
  { path: 'about', component: AboutComponent, data: {title: 'Über uns'} },
  // ECMAScript2015-Spread-Operator ... -> insert all elements in array appRoutes
  //...taskRoutes1
  // Componentless-Routes (without path-definition in TasksComponent)
  { path: 'tasks', canActivate: [LoginGuard], children: taskRoutes2 },
  { path: 'login', component: LoginComponent },
  { path: 'overview/:id', component: TaskOverviewComponent, outlet: 'right' },
  { path: 'chat', component: ChatComponent, outlet: 'bottom' },
  { path: '**', component: NotFoundComponent } // letzte Konfiguration!
];

// register all routing services
export const appRouting = RouterModule.forRoot(appRoutes);

export const routingComponents = [
  DashboardComponent,
  SettingsComponent,
  AboutComponent,
  TaskOverviewComponent,
  ...tasksRoutingComponents
];

// register a function as a value resolver
export function resolveToken(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
  return localStorage.getItem('access-token');
}

export const routingProviders = [
  { provide: RESOLVED_TOKEN, useValue: resolveToken }
];

@NgModule({
  // HashLocation-Strategie
  //imports: [RouterModule.forRoot(appRoutes, { useHash: true })],
  // PathLocation-Strategie
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
