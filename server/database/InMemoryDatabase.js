import _ from 'lodash';

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

  getClients() {
    return _.values(this._clients);
  }

  findClientById(clientId) {
    return _.cloneDeep(this._clients[clientId]);
  }

  deleteClient(client) {
    this._clients = _.omit(this._clients, client.id);
  }

  storeZipCode(zipCode, address) {
    this._codigosPostales[zipCode] = _.cloneDeep(address);
  }

  getAddressByZipCode(zipCode) {
    return _.cloneDeep(this._codigosPostales[zipCode]);
  }
}
