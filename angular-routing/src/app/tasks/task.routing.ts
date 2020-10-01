import { TasksComponent } from './tasks.component';
import { TaskListComponent } from './task-list/task-list.component';
import { EditTaskComponent } from './edit-task/edit-task.component';
import { EditTaskGuard } from '../guards/edit-task.guard';
import { TaskOverviewComponent } from '../task-overview/task-overview.component';

export const taskRoutes1 = [{
    path: 'tasks', component: TasksComponent,
    children: [
        { path: '', component: TaskListComponent },
        { path: 'new', component: EditTaskComponent },
        { path: 'edit/:id', component: EditTaskComponent }
    ]
}];

export const taskRoutes2 = [{
    path: '', component: TasksComponent,
    children: [
        { path: '', component: TaskListComponent },
        { path: 'new', component: EditTaskComponent, canDeactivate: [EditTaskGuard], data: { title: 'Neue Aufgabe anlegen' } },
        // Pfad-Parameter id
        { path: 'edit/:id', component: EditTaskComponent, canDeactivate: [EditTaskGuard], data: { title: 'Aufgabe bearbeiten' } },
        // relative redirect
        { path: 'e/:id', redirectTo: 'edit/:id' },
        // Wildcards
        { path: '**', redirectTo: '' }
    ]
}, {
    path: 'overview/:id',
    component: TaskOverviewComponent,
    outlet: 'right'
}];

export const tasksRoutingComponents = [
    TasksComponent,
    TaskListComponent,
    EditTaskComponent
];
