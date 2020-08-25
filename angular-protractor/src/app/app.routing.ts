import {Routes, RouterModule} from '@angular/router';

import {DashboardComponent} from './dashboard/dashboard.component';
import {SettingsComponent} from './settings/settings.component';
import {AboutComponent} from './about/about.component';
import {LoginComponent} from './login/index';
import {NotFoundComponent} from './not-found/not-found.component';
import {tasksRoutes, tasksRoutingComponents} from './tasks/tasks.routing';
import {RxDemoComponent} from './rxdemo/rxdemo.component';
import {LoginGuard} from './login/login.guard';

export const appRoutes: Routes = [
  {path: 'dashboard', component: DashboardComponent, data: {title: 'Startseite'}},
  {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
  {path: 'settings', component: SettingsComponent, data: { title: 'Einstellungen' },
  },
  {path: 'about', component: AboutComponent, data: {title: 'Über uns'}},
  {path: 'rxdemo', component: RxDemoComponent, data: {title: 'RxJS Demo'}},
  {path: 'login', component: LoginComponent},

  {path: 'tasks', canActivate: [LoginGuard], children: tasksRoutes},

  /** Redirect Konfigurationen **/
  {path: 'tasks/*', redirectTo: '/tasks'},
  {path: '404', component: NotFoundComponent},

  {path: '**', redirectTo: '/404'}, // immer als letztes konfigurieren - erste Route die matched wird angesteuert
];

export const appRouting = RouterModule.forRoot(appRoutes);

export const routingComponents = [DashboardComponent, SettingsComponent, AboutComponent, LoginComponent, NotFoundComponent,
  RxDemoComponent,  ...tasksRoutingComponents];
