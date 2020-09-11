import { Routes } from '@angular/router';

import { Graphic1Component } from '../graphic1/graphic1.component';
import { Graphic2Component } from '../graphic2/graphic2.component';


export const analysisRoutes: Routes = [
    { path: 's1', component: Graphic1Component, outlet: 'graphic' },
    { path: 's2', component: Graphic2Component, outlet: 'graphic' }
];
