import _ from 'lodash';
import Client from './models/Client';
import ClientJSONFormatter from './ClientJSONFormatter';

export class ClientNotFound extends Error { }
export class DuplicatedRFC extends Error { }

export class ClientsController {
  constructor(database) {
    this._database = database;
  }

  getClientsCount() {
    return new Promise(_.bind(function(resolve) {
      this._database.countClients()
        .then(function(count) {
          console.log(count);
          resolve(count);
        });
    }, this));
  }

  getClients(filters) {
    return new Promise(_.bind(function(resolve) {
      this._database.getClients(filters)
        .then(_.bind(function(result) {
          resolve(this._getClients(result));
        }, this));
    }, this));
  }

  _getClients(result) {
    var clients = _.map(result.items, function(client) {
      return ClientJSONFormatter.toJSON(client);
    });

    return {
      total: result.total,
      items: clients
    };
  }

  getClientById(clientId) {
    var _this = this;

    return new Promise(function(resolve, reject) {
      _this._database.findClientById(clientId)
        .then(function(client) {
          if (!client) {
            reject(new ClientNotFound());
          } else {
            resolve(ClientJSONFormatter.toJSON(client));
          }
        });
    });
  }

  createClient(data) {
    var _this = this;
    var client = new Client(data);

    return new Promise(function(resolve, reject) {
      if (!client.isValid()) {
        reject(Error('Los datos del cliente no son válidos'));
      }

      _this._database.findClientByRFC(client.rfc)
        .then(function(clientFound) {
          if (clientFound) {
            return reject(new DuplicatedRFC());
          }

          return _this._database.storeClient(client);
        })
        .then(function() {
          resolve(ClientJSONFormatter.toJSON(client));
        });
    });
  }

  updateClientById(clientId, data) {
    var _this = this;
    var client;

    return new Promise(function(resolve, reject) {
      _this._database.findClientById(clientId)
        .then(function(clientFound) {
          if (!clientFound) {
            return reject(new ClientNotFound());
          }

          client = clientFound;

          _.forIn(data, function(value, key) {
            client[key] = value;
          });

          return _this._database.storeClient(client);
        })
        .then(function() {
          resolve(ClientJSONFormatter.toJSON(client));
        });
    });
  }

  deleteClientById(clientId) {
    var _this = this;
    var client;

    return new Promise(function(resolve, reject) {
      _this._database.findClientById(clientId)
        .then(function(clientFound) {
          if (!clientFound) {
            return reject(new ClientNotFound());
          }

          client = clientFound;

          return _this._database.deleteClient(client);
        })
        .then(function() {
          resolve(ClientJSONFormatter.toJSON(client));
        });
    });
  }
}
