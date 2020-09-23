import { CheckboxItem } from '../checkbox-list/checkbox-list.component';
import { Optional } from '@angular/core';

export interface Refreshable {
    refresh: () => void;
}

export interface Territory {
    territoryId: string;
    territoryName?: string;
    parentId: string;
    parentName?: string;
    orderId?: number;
    regions?: Territory[];
    minDate?: Date,
    maxDate?: Date
}

export class TerritoryItem implements CheckboxItem {
    id?: string;
    position: number;
    text: string;
    data?: any;

    constructor(@Optional() t: Territory) {
        if (t) {
            this.id = t.territoryId + '-' + t.parentId;
            this.position = 1;
            this.text = t.territoryName;
            if (t.parentName != null) {
                this.text += ' (' + t.parentName + ')';
            }
            this.data = t;
        }
    }
};
