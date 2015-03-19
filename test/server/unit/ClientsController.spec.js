import _ from 'lodash';
import InMemoryDatabase from '../../../server/database/InMemoryDatabase';
import Client from '../../../server/models/Client';
import {ClientsController,ClientNotFound,DuplicatedRFC} from '../../../server/ClientsController';

function insertMockedClients(database, quantity) {
  'use strict';
  quantity = quantity || 1;
  var promises = [];

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

    promises.push(database.storeClient(client));
  }

  return Promise.all(promises);
}

describe('ClientsController', function() {
  'use strict';

  beforeEach(function(done) {
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
    this.database.storeClient(client).then(() => done());
  });

  describe('Create new clients', function() {
    it('stores client in database', function(done) {
      var _this = this;
      var clientData = {
        nombre: 'John',
        apellidoPaterno: 'Doe',
        rfc: 'ABC234567ABA',
        codigoPostal: '80280',
        numeroCliente: '1000'
      };

      this.database.getClients()
        .then(function(clients) {
          expect(clients.total).to.be.equal(1);
          expect(clients.items).to.have.a.lengthOf(1);
          return _this.controller.createClient(clientData);
        })
        .then(function(client) {
          expect(client).to.have.property('id').that.is.a('string');
          return _this.database.getClients();
        })
        .then(function(clients) {
          expect(clients.total).to.be.equal(2);
          expect(clients.items).to.have.a.lengthOf(2);
          done();
        })
        .catch(function(err) {
          done(err);
        });
    });

    it('validates client before save client on database', function(done) {
      this.controller.createClient({ nombre: 'John' })
        .then(null, function(err) {
          expect(err).to.be.an.instanceOf(Error);
          done();
        })
        .catch(function(err) {
          done(err);
        });
    });

    it('do not allow to use duplicated RFC', function(done) {
      var clientData = {
        nombre: 'John',
        apellidoPaterno: 'Doe',
        rfc: 'ABC234567ABA',
        codigoPostal: '80280',
        numeroCliente: '1000'
      };

      this.controller.createClient(clientData)
        .then(_.bind(function() {
          return this.controller.createClient(clientData);
        }, this))
        .catch(function(err) {
          try {
            expect(err).to.be.an.instanceOf(DuplicatedRFC);
            done();
          } catch (err) {
            done(err);
          }
        });
    });
  });

  describe('Get list of clients', function() {
    it('returns a list of all clients', function(done) {
      this.controller.getClients()
        .then(function(clients) {
          expect(clients.total).to.be.equal(1);
          expect(clients.items).to.not.be.empty;
          expect(clients.items).to.have.a.lengthOf(1);
          done();
        })
        .catch(function(err) {
          done(err);
        });
    });

    describe('filtered by RFC', function() {
      beforeEach(function(done) {
        // Insert 99 mock clients to complete 20 mocked clients
        insertMockedClients(this.database, 19).then(() => done());
      });

      it('finds clients with exact RFC', function(done) {
        this.controller.getClients({ rfc: 'ABC123456ABA' })
          .then(function(clients) {
            expect(clients.total).to.be.equal(1);
            expect(clients.items).to.have.a.lengthOf(1);
            done();
          })
          .catch(function(err) {
            done(err);
          });
      });

      it('finds clients with part of the RFC', function(done) {
        this.controller.getClients({ rfc: '0ABA' })
          .then(function(clients) {
            expect(clients.total).to.be.equal(2);
            expect(clients.items).to.have.a.lengthOf(2);
            done();
          })
          .catch(function(err) {
            done(err);
          });
      });
    });

    describe('with paginated results', function() {
      beforeEach(function(done) {
        // Insert 99 mock clients to complete 100 mocked clients
        insertMockedClients(this.database, 99).then(() => done());
      });

      it('limits the number of items returned', function(done) {
        this.controller.getClients({ limit: 10 })
          .then(function(clients) {
            try {
              expect(clients.total).to.be.equal(100);
              expect(clients.items).to.have.a.lengthOf(10);
              done();
            } catch (err) {
              done(err);
            }
          });
      });

      it('limits the number of items returned by default', function(done) {
        this.controller.getClients()
          .then(function(clients) {
            try {
              expect(clients.total).to.be.equal(100);
              expect(clients.items).to.have.a.lengthOf(10);
              done();
            } catch (err) {
              done(err);
            }
          });
      });

      it('skips a number of results', function(done) {
        this.controller.getClients({ skip: 10 })
          .then(function(clients) {
            try {
              // If 10 items are skipped, the next client id will be 11
              expect(clients.total).to.be.equal(100);
              expect(clients.items[0].id).to.be.equal('11');
              done();
            } catch (err) {
              done(err);
            }
          });
      });

      it('limits filtered results', function(done) {
        this.controller.getClients({ limit: 5, rfc: '0ABA' })
          .then(function(clients) {
            expect(clients.total).to.be.equal(10);
            expect(clients.items).to.have.a.lengthOf(5);
            done();
          })
          .catch(function(err) {
            done(err);
          });
      });
    });
  });

  describe('Find a client by id', function() {
    it('gets and return the client', function(done) {
      var _this = this;

      this.controller.getClients()
        .then(function(clients) {
          return _this.controller.getClientById(clients.items[0].id);
        })
        .then(function(client) {
          expect(client).to.not.be.undefined;
          expect(client).to.have.property('id');
          expect(client).to.have.property('nombre');
          done();
        })
        .catch(function(err) {
          done(err);
        });
    });

    it('fails if client does not exists', function(done) {
      this.controller.getClientById('NotExists')
        .then(null, function(err) {
          expect(err).to.be.an.instanceOf(ClientNotFound);
          done();
        })
        .catch(function(err) {
          done(err);
        });
    });
  });

  describe('Update a client by id', function() {
    it('repaces data of a client with new data', function(done) {
      var _this = this;
      var clientBeforeUpdate;

      this.controller.getClients()
        .then(function(clients) {
          clientBeforeUpdate = clients.items[0];

          return _this.controller.updateClientById(clientBeforeUpdate.id, {
            nombre: 'Jane',
            codigoPostal: '10000',
            numeroCliente: '100',
            rfc: 'XYZ987654XYA'
          });
        })
        .then(function(client) {
          expect(client).to.have.property('id');
          expect(client.id).to.be.equal(clientBeforeUpdate.id);
          expect(client.nombre).to.be.equal('Jane');
          expect(client.rfc).to.be.equal('XYZ987654XYA');
          done();
        })
        .catch(function(err) {
          done(err);
        });
    });

    it('stores new data in the database', function(done) {
      var _this = this;
      var client;

      this.controller.getClients()
        .then(function(clients) {
          client = clients.items[0];
          return _this.controller.updateClientById(client.id, {
            nombre: 'Jane',
            rfc: 'XYZ987654XYA'
          });
        }).then(function() {
          return _this.database.findClientById(client.id);
        })
        .then(function(client) {
          expect(client.nombre).to.be.equal('Jane');
          expect(client.rfc).to.be.equal('XYZ987654XYA');
          done();
        })
        .catch(function(err) {
          done(err);
        });
    });

    it('throws an error if client does not exists', function(done) {
      this.controller.updateClientById('NotExists')
        .then(null, function(err) {
          expect(err).to.be.an.instanceOf(ClientNotFound);
          done();
        })
        .catch(function(err) {
          done(err);
        });
    });
  });

  describe('Delete a client', function() {
    it('removes the client from database', function(done) {
      var _this = this;

      this.database.getClients()
        .then(function(clients) {
          expect(clients.total).to.be.equal(1);
          expect(clients.items).to.have.a.lengthOf(1);

          return _this.controller.deleteClientById(clients.items[0].id);
        })
        .then(function() {
          return _this.database.getClients();
        })
        .then(function(clients) {
          expect(clients.total).to.be.equal(0);
          expect(clients.items).to.be.empty;
          done();
        })
        .catch(function(err) {
          done(err);
        });
    });

    it('fails if client does not exists', function(done) {
      this.controller.deleteClientById('NotExists')
        .catch(function(err) {
          try {
            expect(err).to.be.an.instanceOf(ClientNotFound);
            done();
          } catch (err) {
            done(err);
          }
        });
    });
  });

  describe('Count clients', function() {
    it('returns the number of clients in the database', function(done) {
      var _this = this;

      this.controller.getClientsCount()
        .then(function(count) {
          expect(count).to.be.equal(1);
          return insertMockedClients(_this.database, 29);
        })
        .then(function() {
          return _this.controller.getClientsCount();
        })
        .then(function(count) {
          expect(count).to.be.equal(30);
          done();
        })
        .catch(function(err) {
          done(err);
        });
    });
  });
});
