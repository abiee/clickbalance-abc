import _ from 'lodash';

const DEFAULT_LIMIT = 10;

export default class InMemoryDatabase {
  constructor() {
    this._clients = {};
    this._codigosPostales = {};

    this._clientsLastId = 0;
  }

  storeClient(client) {
    if (!client.id) {
      client.id = String(++this._clientsLastId);
    }
    this._clients[client.id] = _.cloneDeep(client);

    return new Promise(function(resolve) {
      resolve(client);
    });
  }

  getClients(filters) {
    filters = filters || {};
    var limit = filters.limit || DEFAULT_LIMIT;
    var skip = filters.skip || 0;
    var clients = _.values(this._clients);

    if (filters.rfc && _.trim(filters.rfc) !== '') {
      let rfc = _.trim(filters.rfc);
      let regex = new RegExp(rfc);
      clients = _.filter(clients, function(client) {
        return client.rfc.match(regex, 'i');
      });
    }

    var totalResults = clients.length;
    clients = _.slice(clients, skip);

    return new Promise(function(resolve) {
      resolve({
        total: totalResults,
        items: _.take(clients, limit)
      });
    });
  }

  findClientById(clientId) {
    return new Promise(_.bind(function(resolve) {
      resolve(_.cloneDeep(this._clients[clientId]));
    }, this));
  }

  findClientByRFC(rfc) {
    return new Promise(_.bind(function(resolve) {
      resolve(_.find(_.values(this._clients), function(client) {
        return client.rfc === rfc;
      }));
    }, this));
  }

  deleteClient(client) {
    return new Promise(_.bind(function(resolve) {
      this._clients = _.omit(this._clients, client.id);
      resolve();
    }, this));
  }

  countClients() {
    return new Promise(_.bind(function(resolve) {
      resolve(_.values(this._clients).length);
    }, this));
  }

  storeZipCode(zipCode, address) {
    return new Promise(_.bind(function(resolve) {
      this._codigosPostales[zipCode] = _.cloneDeep(address);
      resolve();
    }, this));
  }

  getAddressByZipCode(zipCode) {
    return new Promise(_.bind(function(resolve) {
      resolve(_.cloneDeep(this._codigosPostales[zipCode]));
    }, this));
  }
}
