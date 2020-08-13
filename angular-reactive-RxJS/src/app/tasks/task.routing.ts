import { TasksComponent } from './tasks.component';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskOverviewComponent } from './task-overview/task-overview.component';

export const taskRoutes = [{
    path: '', component: TasksComponent,
    children: [
        { path: '', component: TaskListComponent }
    ]
}, {
    path: 'overview/:id',
    component: TaskOverviewComponent,
    outlet: 'right'
}];

export const tasksRoutingComponents = [
    TasksComponent,
    TaskListComponent,
    TaskOverviewComponent
];
