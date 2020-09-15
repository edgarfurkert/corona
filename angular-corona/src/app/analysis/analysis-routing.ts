import { Routes } from '@angular/router';

import { HistoricalGraphComponent } from '../historical-graph/historical-graph.component';
import { HistoricalBubblesGraphComponent } from '../historical-bubbles-graph/historical-bubbles-graph.component';

/*
path	historical
path	historicalBubbles
path	historicalStackedAreas
path	infectionsAnd
path	top25Of
path	startOf
*/
export const analysisRoutes: Routes = [
    { path: 'historical', component: HistoricalGraphComponent, outlet: 'graphic' },
    { path: 'historicalBubbles', component: HistoricalBubblesGraphComponent, outlet: 'graphic' }
];
