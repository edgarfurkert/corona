import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnalysisComponent } from './analysis/analysis.component';
import { DataInfoComponent } from './data-info/data-info.component';
import { analysisRoutes } from './analysis/analysis-routing';

const routes: Routes = [
  { path: 'analysis', component: AnalysisComponent, children: analysisRoutes },
  { path: 'datainfo', component: DataInfoComponent },
  { path: '', redirectTo: 'analysis', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
