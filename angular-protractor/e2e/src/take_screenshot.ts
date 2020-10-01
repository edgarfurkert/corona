import * as fs from 'fs';
import { browser } from 'protractor';

export function takeScreenshot(filename: string) {
    browser.takeScreenshot().then((data) => {
        const stream = fs.createWriteStream(filename);
        stream.write(new Buffer(data, 'base64'));
        stream.end();
    });
}