/* global console */
import _ from 'lodash';
import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import jsonschema from 'jsonschema';
// @ifdef DEVELOPMENT
import morgan from 'morgan';
// @endif
// @ifdef PRODUCTION
import serveStatic from 'serve-static';
// @endif

import {ClientsController,ClientNotFound} from './ClientsController';
import InMemoryDatabase from './database/InMemoryDatabase';

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

var clientSchema = {
  id: '/ClientSchema',
  type: 'object',
  properties: {
    nombre: { type: 'string' },
    apellidoPaterno: { type: 'string' },
    apellidoMaterno: { type: 'string' },
    rfc: { type: 'string' },
    regimen: { type: 'string' },
    codigoPostal: { type: 'string' },
    estado: { type: 'string' },
    ciudad: { type: 'string' },
    colonia: { type: 'string' },
    numeroCliente: { type: 'string' },
    cuentaContable: { type: 'string' }
  },
  required: ['nombre', 'rfc', 'numeroCliente']
};

var database = new InMemoryDatabase();
var clientsController = new ClientsController(database);

app.get('/api/clientes', function(req, res) {
  'use strict';
  res.json(clientsController.getClients());
});

app.get('/api/clientes/:id', function(req, res) {
  'use strict';
  var id = req.params.id;

  try {
    let client = clientsController.getClientById(id);
    res.json(client);
  } catch (err) {
    res.status(404).json({ error: 'El cliente no existe' });
  }
});

app.post('/api/clientes', function(req, res) {
  'use strict';
  var clientData = req.body;
  var validator = new jsonschema.Validator();
  var validation = validator.validate(clientData, clientSchema);

  if (!_.isEmpty(validation.errors)) {
    res.status(400).json({ error: validation.errors });
    return;
  }

  try {
    var client = clientsController.createClient(clientData);
    res.json(client);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/clientes/:id', function(req, res) {
  'use strict';
  var id = req.params.id;
  var clientData = req.body;
  var validator = new jsonschema.Validator();
  var validation = validator.validate(clientData, clientSchema);

  if (!_.isEmpty(validation.errors)) {
    res.status(400).json({ error: validation.errors });
    return;
  }

  try {
    var updatedClient = clientsController.updateClientById(id, clientData);
    res.json(updatedClient);
  } catch (err) {
    if (err instanceof ClientNotFound) {
      res.status(404).json({ error: 'El cliente no existe' });
    } else {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
});

app.delete('/api/clientes/:id', function(req, res) {
  'use strict';
  var id = req.params.id;

  try {
    var clientDeleted = clientsController.deleteClientById(id);
    res.json(clientDeleted);
  } catch (err) {
    if (err instanceof ClientNotFound) {
      res.status(404).json({ error: 'El cliente no existe' });
    } else {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
});

http.createServer(app).listen(3000, function() {
  'use strict';
  console.log('Express server started!');
});

