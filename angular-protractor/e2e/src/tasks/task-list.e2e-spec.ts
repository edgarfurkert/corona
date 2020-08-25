import { browser, element, by } from 'protractor';
import { TaskListPage } from './task-list-po';
import { takeScreenshot } from '../take_screenshot';

describe('Task List (with Page Object)', () => {

    let page: TaskListPage;

    beforeEach(() => {
        page = new TaskListPage();
        page.navigateTo();        
    });

    it('should allow searching for tasks', () => {
        page.searchForTasks('Ersten');
        expect(page.getTaskCount()).toEqual(1);
    });

    it('should work with no search results', () => {
        page.searchForTasks('Ich existiere nicht');
        expect(page.getTaskCount()).toEqual(0);
    });

    it('should allow to create new tasks', () => {
        const taskTitle = `New Task ${new Date().getTime()}`;
        const editPage = page.gotoNewTaskView();
        editPage.fillForm(taskTitle, 'IN_PROGRESS');
        //editPage.save();
        //browser.sleep(600000); // to debug in browser
        takeScreenshot('createTaskFailure.png');
        page.checkTaskDisplayed(taskTitle);
    });

    it('should add new tasks to the displayed list', () => {
        page.getTaskCount().then(count => {
            const editPage = page.gotoNewTaskView();
            editPage.fillForm('New Task', 'BACKLOG');
            editPage.save();
            expect(page.getTaskCount()).toEqual(count + 1);
        });
    });
});