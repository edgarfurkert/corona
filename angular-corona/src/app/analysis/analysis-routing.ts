import { Routes } from '@angular/router';

import { HistoricalGraphComponent } from '../historical-graph/historical-graph.component';
import { HistoricalBubblesGraphComponent } from '../historical-bubbles-graph/historical-bubbles-graph.component';
import { HistoricalStackedAreasGraphComponent } from '../historical-stacked-areas-graph/historical-stacked-areas-graph.component';
import { InfectionsAndGraphComponent } from '../infections-and-graph/infections-and-graph.component';
import { Top25GraphComponent } from '../top25-graph/top25-graph.component';
import { StartOfGraphComponent } from '../start-of-graph/start-of-graph.component';

/*
Routes:
path	historical
path	historicalBubbles
path	historicalStackedAreas
path	infectionsAnd
path	top25Of
path	startOf
*/
export const analysisRoutes: Routes = [
    { path: 'historical', component: HistoricalGraphComponent, outlet: 'graphic' },
    { path: 'historicalBubbles', component: HistoricalBubblesGraphComponent, outlet: 'graphic' },
    { path: 'historicalStackedAreas', component: HistoricalStackedAreasGraphComponent, outlet: 'graphic' },
    { path: 'infectionsAnd', component: InfectionsAndGraphComponent, outlet: 'graphic' },
    { path: 'top25Of', component: Top25GraphComponent, outlet: 'graphic' },
    { path: 'startOf', component: StartOfGraphComponent, outlet: 'graphic' }
];
