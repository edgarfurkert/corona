import { browser, element, by } from "protractor";

describe('Task List (without Page Object)', () => {

    beforeEach(() => {
        browser.get('/tasks');        
    });

    it('should allow searching for tasks', () => {
        element(by.id('search-tasks')).sendKeys('Ersten');
        browser.sleep(500);

        const count = element.all(by.className('task-list-entry')).count();
        expect(count).toEqual(1);
    });
});