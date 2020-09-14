import { Routes } from '@angular/router';

import { Graphic1Component } from '../graphic1/graphic1.component';
import { Graphic2Component } from '../graphic2/graphic2.component';


export const analysisRoutes: Routes = [
    { path: 'historical', component: Graphic1Component, outlet: 'graphic' },
    { path: 'historicalBubbles', component: Graphic2Component, outlet: 'graphic' }
];
