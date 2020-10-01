// @ts-check
// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require('jasmine-spec-reporter');

var HtmlScreenshotReporter = require('protractor-jasmine2-screenshot-reporter');

var reporter = new HtmlScreenshotReporter({
    dest: './html-report',
    filename: 'test-report.html',
    cleanDestination: true,
    ignoreSkippedSpecs: true,
    captureOnlyFailedSpecs: false
});

/**
 * @type { import("protractor").Config }
 */
exports.config = {
    allScriptsTimeout: 11000,
    specs: [
        './src/**/*.e2e-spec.ts'
    ],
    capabilities: {
        browserName: 'firefox',
        //browserName: 'chrome',
        /*
        chromeOptions: {
            useAutomationExtension: false
        }
        */
        /*
        chromeOptions: {
            args: ["--headless", "--disable-gpu", "--window-size=800,600"]
        }
        */
    },
    directConnect: true,
    baseUrl: 'http://localhost:4200/',
    framework: 'jasmine',
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 30000,
        print: function() {}
    },
    /*
    plugins: [{
        package: 'protractor-console',
        logLevels: ['debug']
    }],
    */
    beforeLaunch: function() {
        require('ts-node').register({
            project: 'e2e'
        });
    },
    afterLaunch: function(exitCode) {
        return new Promise(function(resolve) {
            reporter.afterLaunch(resolve.bind(this, exitCode));
        });
    },
    onPrepare() {
        jasmine.getEnv().addReporter(reporter);
        jasmine.getEnv().addReporter(new SpecReporter);
    }
};