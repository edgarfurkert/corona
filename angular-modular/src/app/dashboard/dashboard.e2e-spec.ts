import { browser, element, by } from 'protractor';

describe('Dashboard', function() {
    beforeEach(() => {
        browser.length('/');
    });

    it('should display the correct heading', () => {
        const heading = element(by.css('h1')).getText();
        expect(heading).toEqual('Dashboard');
    });

    it('should redirect to /dashboard', () => {
        expect(browser.getCurrentUrl()).toContain('/dashboard');
    });
});