import { EditTaskPage } from "./edit-task.po";
import { browser } from 'protractor';

describe('Edit Tasks', function() {
    let page: EditTaskPage;

    beforeEach(() => {
        page = new EditTaskPage();
        page.navigateToNewPage();
    });

    it('should change page when accepting alert', () => {
        page.fillForm('New Task', 'BACKLOG');
        page.cancel();
        page.getAlert().accept(); // Klick auf OK
        expect(browser.getCurrentUrl()).not.toContain(page.newUrl);
    });

    it('should stay on page when discarding alert', () => {
        page.fillForm('New Task', 'BACKLOG');
        page.cancel();
        page.getAlert().dismiss(); // Klick auf Abbrechen
        expect(browser.getCurrentUrl()).toContain(page.newUrl);
    });
});