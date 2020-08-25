import { browser, element, by } from 'protractor';

describe('Dashboard', function() {
    beforeEach(() => {
        browser.get('/');
    });

    it('should display the correct heading', () => {
        // heading enthält ein Promise!
        const heading = element(by.css('h1')).getText();
        heading.then((headingText) => {
            console.log('headingText', headingText);
        });
        expect(heading).toEqual('Dashboard');

        //browser.sleep(10000);
    });

    it('should redirect to /dashboard', () => {
        expect(browser.getCurrentUrl()).toContain('/dashboard');
    });
});