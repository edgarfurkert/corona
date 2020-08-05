export interface Tag {
  label: string;
}
export interface User {
  gender?: string;
  firstName?: string;
  name?: string;
  email?: string;
}
export interface Task {
  id?: number;
  title?: string;
  description?: string;
  tags?: Tag[];
  favorite?: boolean;
  state?: string;
  assignee?: User;
}

export function createInitialTask(): Task {
  return {
    assignee: {},
    tags: [],
    state: states[0]
  };
}

export const states = ['BACKLOG', 'IN_PROGRESS', 'TEST', 'COMPLETED'];

export const stateTexts = {
  BACKLOG: 'Backlog',
  IN_PROGRESS: 'In Bearbeitung',
  TEST: 'Im Test',
  COMPLETED: 'Abgeschlossen'
};
