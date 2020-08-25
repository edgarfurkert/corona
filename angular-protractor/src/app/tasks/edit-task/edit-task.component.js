import { ViewChild, Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import { createInitialTask } from '../../models/model-interfaces';
import { TaskService } from '../../services/task-service/task.service';
import * as model from '../../models/model-interfaces';
export var EditTaskComponent = (function () {
    function EditTaskComponent(route, taskService, router, titleService, location) {
        this.route = route;
        this.taskService = taskService;
        this.router = router;
        this.titleService = titleService;
        this.location = location;
        this.model = model;
        this.task = createInitialTask();
        this.saved = false;
    }
    EditTaskComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.subscription = this.route.params
            .map(function (params) { return params['id']; })
            .filter(function (id) { return id != undefined; })
            .flatMap(function (id) { return _this.taskService.getTask(id); })
            .subscribe(function (task) {
            _this.task = task;
        });
    };
    EditTaskComponent.prototype.ngOnDestroy = function () {
        this.subscription.unsubscribe();
    };
    EditTaskComponent.prototype.addTag = function () {
        this.task.tags.push({ label: '' });
        return false;
    };
    EditTaskComponent.prototype.removeTag = function (i) {
        this.task.tags.splice(i, 1);
        return false;
    };
    EditTaskComponent.prototype.saveTask = function () {
        var _this = this;
        this.taskService.saveTask(this.task).subscribe(function (task) {
            _this.saved = true;
            var relativeUrl = _this.router.url.includes('edit') ? '../..' : '..';
            _this.router.navigate([relativeUrl], { relativeTo: _this.route });
        });
    };
    EditTaskComponent.prototype.cancel = function () {
        //this.location.back();
        var relativeUrl = this.router.url.includes('edit') ? '../..' : '..';
        this.router.navigate([relativeUrl], { relativeTo: this.route });
        return false;
    };
    EditTaskComponent.prototype.canDeactivate = function () {
        if (this.saved || !this.form.dirty) {
            return true;
        }
        return window.confirm("Ihr Formular besitzt ungespeicherte \u00C4nderungen, m\u00F6chten Sie die Seite wirklich verlassen?");
    };
    EditTaskComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: './edit-task.component.html',
                    styleUrls: ['./edit-task.component.css']
                },] },
    ];
    /** @nocollapse */
    EditTaskComponent.ctorParameters = [
        { type: ActivatedRoute, },
        { type: TaskService, },
        { type: Router, },
        { type: Title, },
        { type: Location, },
    ];
    EditTaskComponent.propDecorators = {
        'form': [{ type: ViewChild, args: [NgForm,] },],
    };
    return EditTaskComponent;
}());
//# sourceMappingURL=edit-task.component.js.map