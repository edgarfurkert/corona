import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnalysisComponent } from './analysis/analysis.component';
import { DataInfoComponent } from './data-info/data-info.component';

const routes: Routes = [
  { path: 'analysis', component: AnalysisComponent },
  { path: 'datainfo', component: DataInfoComponent },
  { path: '', redirectTo: 'analysis', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
