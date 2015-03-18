import _ from 'lodash';
import InMemoryDatabase from '../../../server/database/InMemoryDatabase';
import Client from '../../../server/models/Client';
import {ClientsController, ClientNotFound} from '../../../server/ClientsController';

function insertMockedClients(database, quantity) {
  'use strict';
  quantity = quantity || 1;

  for(let i=0; i<quantity; i++) {
    let rfc = 'ABC' + _.padLeft(i, 6, '0') + 'ABA';
    let numeroCliente = _.padLeft(i, 4, '0');
    let client = new Client({
      nombre: 'John',
      apellidoPaterno: 'Doe',
      rfc: rfc,
      numeroCliente: numeroCliente,
      codigoPostal: '80280'
    });

    database.storeClient(client);
  }
}

describe('ClientsController', function() {
  'use strict';

  beforeEach(function() {
    this.database = new InMemoryDatabase();
    this.controller = new ClientsController(this.database);

    // Create and save on database a mock client
    var client = new Client({
      nombre: 'John',
      apellidoPaterno: 'Doe',
      rfc: 'ABC123456ABA',
      numeroCliente: '0100',
      codigoPostal: '80280'
    });
    this.database.storeClient(client);
  });

  describe('Create new clients', function() {
    beforeEach(function() {
    });

    it('stores client in database', function() {
      var clientData = {
        nombre: 'John',
        apellidoPaterno: 'Doe',
        rfc: 'ABC123456ABA',
        codigoPostal: '80280',
        numeroCliente: '1000'
      };

      var clients = this.database.getClients();
      expect(clients.total).to.be.equal(1);
      expect(clients.items).to.have.a.lengthOf(1);

      var client = this.controller.createClient(clientData);
      clients = this.database.getClients();

      expect(clients.total).to.be.equal(2);
      expect(clients.items).to.have.a.lengthOf(2);
      expect(client).to.have.property('id').that.is.a('string');
    });

    it('validates client before save client on database', function() {
      var _this = this;
      function createUser() {
        _this.controller.createClient({ nombre: 'John' });
      }
      expect(createUser).to.throw(Error);
    });
  });

  describe('Get list of clients', function() {
    it('returns a list of all clients', function() {
      var clients = this.controller.getClients();
      expect(clients.total).to.be.equal(1);
      expect(clients.items).to.not.be.empty;
      expect(clients.items).to.have.a.lengthOf(1);
    });

    describe('filtered by RFC', function() {
      beforeEach(function() {
        // Insert 99 mock clients to complete 20 mocked clients
        insertMockedClients(this.database, 19);
      });

      it('finds clients with exact RFC', function() {
        var clients = this.controller.getClients({
          rfc: 'ABC123456ABA'
        });
        expect(clients.total).to.be.equal(1);
        expect(clients.items).to.have.a.lengthOf(1);
      });

      it('finds clients with part of the RFC', function() {
        var clients = this.controller.getClients({
          rfc: '0ABA'
        });
        expect(clients.total).to.be.equal(2);
        expect(clients.items).to.have.a.lengthOf(2);
      });
    });

    describe('with paginated results', function() {
      beforeEach(function() {
        // Insert 99 mock clients to complete 100 mocked clients
        insertMockedClients(this.database, 99);
      });

      it('limits the number of items returned', function() {
        var clients = this.controller.getClients({
          limit: 10
        });
        expect(clients.total).to.be.equal(100);
        expect(clients.items).to.have.a.lengthOf(10);
      });

      it('limits the number of items returned by default', function() {
        var clients = this.controller.getClients();
        expect(clients.total).to.be.equal(100);
        expect(clients.items).to.have.a.lengthOf(10);
      });

      it('skips a number of results', function() {
        var clients = this.controller.getClients({
          skip: 10
        });
        // If 10 items are skipped, the next client id will be 11
        expect(clients.total).to.be.equal(100);
        expect(clients.items[0].id).to.be.equal('11');
      });

      it('limits filtered results', function() {
        var clients = this.controller.getClients({
          limit: 5,
          rfc: '0ABA'
        });
        expect(clients.total).to.be.equal(10);
        expect(clients.items).to.have.a.lengthOf(5);
      });
    });
  });

  describe('Find a client by its id', function() {
    it('find and return the client', function() {
      var clients = this.controller.getClients();
      var client = this.controller.getClientById(clients.items[0].id);
      expect(client).to.not.be.undefined;
      expect(client).to.have.property('id');
      expect(client).to.have.property('nombre');
    });

    it('throws an error if client does not exists', function() {
      var _this = this;
      function getClientById() {
        _this.controller.getClientById('NotExists');
      }
      expect(getClientById).to.throw(ClientNotFound);
    });
  });

  describe('Update a client by its id', function() {
    it('repaces data of a client with new data', function() {
      var clients = this.controller.getClients();
      var client = this.controller.updateClientById(clients.items[0].id, {
        nombre: 'Jane',
        rfc: 'XYZ987654XYA'
      });
      expect(client).to.have.property('id');
      expect(client.id).to.be.equal(clients.items[0].id);
      expect(client.nombre).to.be.equal('Jane');
      expect(client.rfc).to.be.equal('XYZ987654XYA');
    });

    it('stores new data in the database', function() {
      var clients = this.controller.getClients();
      this.controller.updateClientById(clients.items[0].id, {
        nombre: 'Jane',
        rfc: 'XYZ987654XYA'
      });
      var client = this.database.findClientById(clients.items[0].id);
      expect(client.nombre).to.be.equal('Jane');
      expect(client.rfc).to.be.equal('XYZ987654XYA');
    });

    it('throws an error if client does not exists', function() {
      var _this = this;
      function updateClientById() {
        _this.controller.updateClientById('NotExists');
      }
      expect(updateClientById).to.throw(ClientNotFound);
    });
  });

  describe('Delete a client', function() {
    it('removes the client from database', function() {
      var clients = this.database.getClients();
      expect(clients.total).to.be.equal(1);
      expect(clients.items).to.have.a.lengthOf(1);

      this.controller.deleteClientById(clients.items[0].id);
      clients = this.database.getClients();
      expect(clients.total).to.be.equal(0);
      expect(clients.items).to.be.empty;
    });

    it('throws an error if client does not exists', function() {
      var _this = this;
      function deleteClient() {
        _this.controller.deleteClientById('NotExists');
      }
      expect(deleteClient).to.throw(ClientNotFound);
    });
  });

  describe('Count clients', function() {
    it('returns the number of clients in the database', function() {
      expect(this.controller.getClientsCount()).to.be.equal(1);
      insertMockedClients(this.database, 29);
      expect(this.controller.getClientsCount()).to.be.equal(30);
    });
  });
});
