import { Injectable } from '@angular/core';
export var EditTaskGuard = (function () {
    function EditTaskGuard() {
    }
    EditTaskGuard.prototype.canDeactivate = function (component, route, router) {
        return component.canDeactivate();
    };
    EditTaskGuard.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    EditTaskGuard.ctorParameters = [];
    return EditTaskGuard;
}());
//# sourceMappingURL=edit-task.guard.js.map