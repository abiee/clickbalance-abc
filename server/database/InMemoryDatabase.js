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
        return client.rfc.match(regex);
      });
    }

    var totalResults = clients.length;

    clients = _.slice(clients, skip);
    return {
      total: totalResults,
      items: _.take(clients, limit)
    };
  }

  findClientById(clientId) {
    return _.cloneDeep(this._clients[clientId]);
  }

  findClientByRFC(rfc) {
    return _.find(_.values(this._clients), function(client) {
      return client.rfc === rfc;
    });
  }

  deleteClient(client) {
    this._clients = _.omit(this._clients, client.id);
  }

  countClients() {
    return _.values(this._clients).length;
  }

  storeZipCode(zipCode, address) {
    this._codigosPostales[zipCode] = _.cloneDeep(address);
  }

  getAddressByZipCode(zipCode) {
    return _.cloneDeep(this._codigosPostales[zipCode]);
  }
}
