import InMemoryDatabase from '../../../server/database/InMemoryDatabase';
import Client from '../../../server/models/Client';
import {ClientsController, ClientNotFound} from '../../../server/ClientsController';

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
      codigoPostal: '80280'
    });
    this.database.storeClient(client);
  });

  describe('Create new clients', function() {
    beforeEach(function() {
      this.clientData = {
        nombre: 'John',
        apellidoPaterno: 'Doe',
        rfc: 'ABC123456ABA',
        codigoPostal: '80280'
      };
    });

    it('stores client in database', function() {
      expect(this.database.getClients()).to.have.a.lengthOf(1);
      var client = this.controller.createClient(this.clientData);
      expect(this.database.getClients()).to.have.a.lengthOf(2);
      expect(client).to.have.property('id').that.is.a('string');
    });

    it('validates client before save client on databse', function() {
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
      expect(clients).to.not.be.empty;
      expect(clients).to.have.a.lengthOf(1);
    });
  });

  describe('Find a client by its id', function() {
    it('finds and return the client', function() {
      var clients = this.controller.getClients();
      var client = this.controller.getClientById(clients[0].id);
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
      var client = this.controller.updateClientById(clients[0].id, {
        nombre: 'Jane',
        rfc: 'XYZ987654XYA'
      });
      expect(client).to.have.property('id');
      expect(client.id).to.be.equal(clients[0].id);
      expect(client.nombre).to.be.equal('Jane');
      expect(client.rfc).to.be.equal('XYZ987654XYA');
    });

    it('stores new data in the database', function() {
      var clients = this.controller.getClients();
      this.controller.updateClientById(clients[0].id, {
        nombre: 'Jane',
        rfc: 'XYZ987654XYA'
      });
      var client = this.database.findClientById(clients[0].id);
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
      expect(clients).to.have.a.lengthOf(1);
      this.controller.deleteClientById(clients[0].id);
      expect(this.database.getClients()).to.be.empty;
    });

    it('throws an error if client does not exists', function() {
      var _this = this;
      function deleteClient() {
        _this.controller.deleteClientById('NotExists');
      }
      expect(deleteClient).to.throw(ClientNotFound);
    });
  });
});
