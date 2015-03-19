/* global console */
import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
// @ifdef DEVELOPMENT
import morgan from 'morgan';
// @endif
// @ifdef PRODUCTION
import serveStatic from 'serve-static';
// @endif
import clientsRoutes from './routes/clients';
import servicesRoutes from './routes/services';

var app = express();
app.use(bodyParser.json());
// @ifdef DEVELOPMENT
app.use(morgan('dev'));
// @endif

// @ifdef PRODUCTION
app.use(serveStatic('app', { index: ['index.html'] }));
app.get('/app*', function(req, res) {
  'use strict';
  res.sendFile(`${__dirname}/app/index.html`);
});
// @endif

clientsRoutes(app);
servicesRoutes(app);

http.createServer(app).listen(3000, function() {
  'use strict';
  console.log('Express server started!');
});

