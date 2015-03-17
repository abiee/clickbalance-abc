import _ from 'lodash';
import Client from './models/Client';
import ClientJSONFormatter from './ClientJSONFormatter';

export class ClientNotFound extends Error { }

export class ClientsController {
  constructor(database) {
    this._database = database;
  }

  getClients() {
    var clients = this._database.getClients();

    return _.map(clients, function(client) {
      return ClientJSONFormatter.toJSON(client);
    });
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
