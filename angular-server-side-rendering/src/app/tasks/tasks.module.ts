import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {tasksRouting, tasksRoutingComponents} from './tasks.routing';
import {SharedModule} from '../shared/shared-module';

@NgModule({
  imports: [ReactiveFormsModule, SharedModule, tasksRouting],
  declarations: [ tasksRoutingComponents ],
})
export class TasksModule {
}