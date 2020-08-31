import {BehaviorSubject} from "rxjs";

export const LOAD = 'LOAD';
export const ADD = 'ADD';
export const EDIT = 'EDIT';
export const REMOVE = 'REMOVE';


type Id = string | number;
interface Identifiable {
  id?: Id;
}

export class Store<T extends Identifiable> {
  items_ = [];
  items$ = new BehaviorSubject<T[]>([]);

  dispatch(action) {
    this.items_ = this._reduce(this.items_, action);
    this.items$.next(this.items_);
  }

  _reduce(items: T[], action) {
    switch (action.type) {
      case LOAD:
        return [...action.data];
      case ADD:
        return [...items, action.data];
      case EDIT:
        return items.map(task => {
          var editedTask = action.data;
          if (task.id !== editedTask.id){
            return task;
          }
          return editedTask;
        });
      case REMOVE:
        return items.filter(task => task.id !== action.data.id);
      default:
        return items;
    }
  }
}