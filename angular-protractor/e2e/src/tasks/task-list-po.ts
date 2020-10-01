import { browser, element, by } from 'protractor';
import { ExpectedConditions as EC } from 'protractor';

import { EditTaskPage } from './edit-task.po';

export class TaskListPage {
    navigateTo() {
        return browser.get('/tasks');
    }

    searchForTasks(term: string) {
        element(by.id('search-tasks')).sendKeys(term);
        browser.sleep(500);
    }

    getTaskCount() {
        return element.all(by.className('task-list-entry')).count();
    }

    gotoNewTaskView() {
        element(by.linkText('Neue Aufgabe anlegen')).click();
        return new EditTaskPage();
    }

    checkTaskDisplayed(text: string) {
        const taskLink = element(by.linkText(text));
        // warte maximal 10 Sekunden
        browser.wait(EC.presenceOf(taskLink), 10000);
    }
}