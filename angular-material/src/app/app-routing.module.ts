import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TimelineComponent } from './timeline/timeline.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
  { path: 'timeline', component: TimelineComponent },
  { path: 'settings', component: SettingsComponent },
  { path: '', redirectTo: 'timeeline', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
