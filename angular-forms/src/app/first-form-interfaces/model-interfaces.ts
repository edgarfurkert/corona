export interface Tag {
    label?: string;
}

export interface User {
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

export const states = ['BACKLOG', 'IN_PROGRESS', 'TEST', 'COMPLETED'];

export function createInitialTask(): Task {
    return { 
        assignee: {}, 
        tags: [],
        state: states[0]
    }
}