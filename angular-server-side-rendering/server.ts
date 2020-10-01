import 'zone.js/dist/zone-node';

import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { join } from 'path';

import { AppServerModule } from './src/main.server';

import { APP_BASE_HREF } from '@angular/common';
import { existsSync } from 'fs';

// The Express app is exported so that it can be used by serverless Functions.
export function app() {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  server.engine('html', ngExpressEngine({
    bootstrap: AppServerModule,
  }));

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // TODO: implement data requests securely
  server.get('/api/**', (req, res) => {
    res.status(404).send('data requests are not yet supported');
  });

  // Serve static files from /browser
  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));

  // All regular routes use the Universal engine
  server.get('*', (req, res) => {
    res.render(indexHtml, { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] });
  });

  return server;
}

function run() {
  const port = process.env.PORT || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
console.log('server.ts: moduleFilename', moduleFilename);
console.log('server.ts: __filename    ', __filename);
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';

/*
import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { join } from 'path';

const app = express();
const { AppServerModule } = require('./dist/server/main');

const DIST_FOLDER = join(process.cwd(), 'dist');
const PORT = process.env.PORT || 4000;

// Express-Engine-Instanz erstellen
app.engine('html', ngExpressEngine({
    bootstrap: AppServerModule,
    providers: [
    ]
}));

// Generierung einer HTML-Seite
app.set('view engine', 'html');

// Für alle Routen die index.html aus dem Verzeichnis dist/browser verwenden
app.set('views', join(DIST_FOLDER, 'browser'));
app.get('*', (req, res) => {
    res.render('index', { req });
});

app.listen(PORT, () => {
    console.log(`Node Express server listening an http://localhost:${PORT}`);
});
*/