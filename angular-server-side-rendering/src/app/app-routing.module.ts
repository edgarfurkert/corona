import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { SettingsComponent } from './settings/settings.component';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { TasksModule } from './tasks/tasks.module';
import { LoginGuard } from './login/login.guard';

function loadTasksModule() {
  return TasksModule;
}

const routes: Routes = [
  {path: 'dashboard', component: DashboardComponent, data: {title: 'Startseite'}},
  {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
  {path: 'settings', component: SettingsComponent, data: { title: 'Einstellungen' },
  },
  {path: 'about', component: AboutComponent, data: {title: 'Über uns'}},
  {path: 'login', component: LoginComponent},

  //{path: 'tasks', loadChildren: './tasks/tasks.module#TasksModule'},
  {path: 'tasks', loadChildren: loadTasksModule, canLoad: [LoginGuard]},

  /** Redirect Konfigurationen **/
  {path: 'tasks/*', redirectTo: '/tasks'},
  {path: '404', component: NotFoundComponent},

  {path: '**', redirectTo: '/404'}, // immer als letztes konfigurieren - erste Route die matched wird angesteuert
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const routingComponents = [DashboardComponent, SettingsComponent, AboutComponent, LoginComponent, NotFoundComponent];
