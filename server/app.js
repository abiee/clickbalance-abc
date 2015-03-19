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

import {ClientsController,ClientNotFound,DuplicatedRFC} from './ClientsController';
import {Services,ZipCodeNotFound} from './Services';
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
var services = new Services(database);

database.storeZipCode('80000', {
  estado: 'SIN',
  ciudad: 'Culiacán',
  colonia: 'Centro'
});

app.get('/api/clientes', function(req, res) {
  'use strict';
  clientsController.getClients(req.query)
    .then(function(clients) {
      res.json(clients);
    })
    .catch(function() {
      res.status(500).json({ error: 'Error interno del servidor' });
    });
});

app.get('/api/clientes/:id', function(req, res) {
  'use strict';
  var id = req.params.id;

  clientsController.getClientById(id)
    .then(function(client) {
      res.json(client);
    })
    .catch(function(err) {
      if (err instanceof ClientNotFound) {
        res.status(404).json({ error: 'El cliente no existe' });
      } else {
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    });
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

  clientsController.createClient(clientData)
    .then(function(client) {
      res.json(client);
    })
    .catch(function(err) {
      if (err instanceof DuplicatedRFC) {
        res.status(409).json({ error: 'El RFC \'' + clientData.rfc + '\' ' +
                                      'ya está registrado' });
      } else {
        res.status(400).json({ error: err.message });
      }
    });
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

  clientsController.updateClientById(id, clientData)
    .then(function(updatedClient) {
      res.json(updatedClient);
    })
    .catch(function(err) {
      if (err instanceof ClientNotFound) {
        res.status(404).json({ error: 'El cliente no existe' });
      } else {
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    });
});

app.delete('/api/clientes/:id', function(req, res) {
  'use strict';
  var id = req.params.id;

  clientsController.deleteClientById(id)
    .then(function(clientDeleted) {
      res.json(clientDeleted);
    })
    .catch(function(err) {
      if (err instanceof ClientNotFound) {
        res.status(404).json({ error: 'El cliente no existe' });
      } else {
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    });
});

app.get('/api/codigo-postal/:code', function(req, res) {
  'use strict';
  var code = req.params.code;

  services.getAddressByZipCode(code)
    .then(function(address) {
      res.json(address);
    })
    .catch(function(err) {
      if (err instanceof ZipCodeNotFound) {
        res.status(404).json({ error: 'Código postal no encontrado' });
      } else {
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    });
});

http.createServer(app).listen(3000, function() {
  'use strict';
  console.log('Express server started!');
});

