import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common'; // statt BrowserModule!
import {ReactiveFormsModule} from '@angular/forms';

import {tasksRouting, tasksRoutingComponents} from './tasks.routing';
import {TaskItemComponent} from './task-list/task-item.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        //FormsModule,      -> SharedModule
        //HttpClientModule, -> SharedModule
        tasksRouting,
        SharedModule.forRoot() // erweitertes SharedModule importieren
    ],
    declarations: [
        tasksRoutingComponents,
        TaskItemComponent
    ]
})
export class TasksModule {

}