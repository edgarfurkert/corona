import { Injectable } from '@angular/core';

import { Store } from "./generic-store";
import { PeriodicElement } from "../../models/data-table.model";

@Injectable({
    providedIn: 'root'
})
export class ElementStore extends Store<PeriodicElement> {

}