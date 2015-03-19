import _ from 'lodash';
import jsonschema from 'jsonschema';
import {ClientsController,ClientNotFound,DuplicatedRFC} from '../ClientsController';
import database from '../database';

var clientsController = new ClientsController(database);

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

module.exports = function(app) {
  'use strict';

  app.get('/api/clientes', function(req, res) {
    var filters = {};

    ['skip', 'limit'].forEach(function(field) {
      if (req.query[field]) {
        let value = parseInt(req.query[field]);
        if (value) {
          filters[field] = value;
        }
      }
    });

    if (req.query.rfc) {
      filters.rfc = req.query.rfc;
    }

    clientsController.getClients(filters)
      .then(function(clients) {
        res.json(clients);
      })
      .catch(function() {
        res.status(500).json({ error: 'Error interno del servidor' });
      });
  });

  app.get('/api/clientes/:id', function(req, res) {
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
        } else if(err instanceof DuplicatedRFC) {
          res.status(409).json({ error: 'El RFC \'' + clientData.rfc + '\' ' +
                                        'ya está registrado' });
        } else {
          res.status(500).json({ error: 'Error interno del servidor' });
        }
      });
  });

  app.delete('/api/clientes/:id', function(req, res) {
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
};
