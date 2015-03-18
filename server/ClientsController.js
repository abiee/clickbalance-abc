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
    return this._database.countClients();
  }

  getClients(filters) {
    var result = this._database.getClients(filters);
    var clients = _.map(result.items, function(client) {
      return ClientJSONFormatter.toJSON(client);
    });

    return {
      total: result.total,
      items: clients
    };
  }

  getClientById(clientId) {
    var client = this._database.findClientById(clientId);

    if (!client) {
      throw new ClientNotFound();
    }

    return ClientJSONFormatter.toJSON(client);
  }

  createClient(data) {
    var client = new Client(data);

    if (!client.isValid()) {
      throw Error('Los datos del cliente no son válidos');
    }

    var duplicatedClient = this._database.findClientByRFC(client.rfc);
    if (duplicatedClient) {
      throw new DuplicatedRFC();
    }

    this._database.storeClient(client);

    return ClientJSONFormatter.toJSON(client);
  }

  updateClientById(clientId, data) {
    var client = this._database.findClientById(clientId);

    if (!client) {
      throw new ClientNotFound();
    }

    _.forIn(data, function(value, key) {
      client[key] = value;
    });

    this._database.storeClient(client);

    return ClientJSONFormatter.toJSON(client);
  }

  deleteClientById(clientId) {
    var client = this._database.findClientById(clientId);

    if (!client) {
      throw new ClientNotFound();
    }

    this._database.deleteClient(client);

    return ClientJSONFormatter.toJSON(client);
  }
}
