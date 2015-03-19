import _ from 'lodash';
import mongodb from 'mongodb';
import MongoDatabase from '../../../../server/database/MongoDatabase';
import Client from '../../../../server/models/Client';

const TEST_DATABASE_URL = 'mongodb://localhost:27017/testdb';

describe('MongoDatabase', function() {
  'use strict';

  describe('#ensureConnection', function() {
    it('connects to the database', function(done) {
      var database = new MongoDatabase(TEST_DATABASE_URL);
      database.ensureConnection()
        .then(function(db) {
          expect(db).to.not.be.undefined;
          expect(db.collection).to.not.be.undefined;
          done();
        })
        .catch(function(err) {
          done(err);
        });
    });

    it('does not connect twice on multiple calls', function(done) {
      var database = new MongoDatabase(TEST_DATABASE_URL);
      var firstDb;

      database.ensureConnection()
        .then(function(db) {
          firstDb = db;
          return database.ensureConnection();
        })
        .then(function(db) {
          expect(db).to.be.equal(firstDb);
          done();
        })
        .catch(function(err) {
          done(err);
        });
    });
  });

  describe('CRUD operations', function() {
    beforeEach(function(done) {
      this.clientRfc = 'ABC1123456ABA';
      this.clientData = {
        nombre: 'John Doe',
        rfc: this.clientRfc
      };

      this.database = new MongoDatabase(TEST_DATABASE_URL);
      this.database.ensureConnection()
        .then(_.bind(function(db) {
          this.db = db;

          // Insert mock data
          db.collection('clientes')
            .insert(this.clientData, _.bind(function(err, result) {
              this.clientId = String(result[0]._id);
              done();
            }, this));
        }, this))
        .catch(done);
    });

    afterEach(function(done) {
      this.db.collection('clientes').drop(function(err) {
        if (err) {
          if (err.errmsg === 'ns not found') {
            this.db.close();
            this.database.db.close();
            this.database.close();
            done();
          } else {
            done(err);
          }
        }
        done();
      });
    });


    describe('getting zip codes', function() {
      beforeEach(function(done) {
        this.db.collection('codigospostales').insert({
          _id: '10000',
          estado: 'SIN',
          colonia: 'Centro',
          ciudad: 'Culiacán'
        }, function(err) {
          if (err) {
            done(err);
          } else {
            done();
          }
        });
      });

      afterEach(function(done) {
        this.db.collection('codigospostales').drop(function(err) {
          if (err) {
            if (err.errmsg === 'ns not found') {
              this.db.close();
              this.database.db.close();
              this.database.close();
              done();
            } else {
              done(err);
            }
          }
          done();
        });
      });

      describe('#storeZipCode', function() {
        it('saves a zip code', function(done) {
          this.database.storeZipCode('8000', {
            estado: 'SIN',
            ciudad: 'Culiacán',
            colonia: 'Centro'
          }).then(function() {
            done();
          });
        });
      });

      describe('#getAddressByZipCode', function() {
        it('gets an address', function(done) {
          this.database.getAddressByZipCode('10000')
            .then(function(address) {
              expect(address).to.not.be.null;
              expect(address).to.have.property('estado', 'SIN');
              expect(address).to.have.property('ciudad', 'Culiacán');
              expect(address).to.have.property('colonia', 'Centro');
              done();
            })
            .catch(done);
        });
      });
    });

    describe('#storeClient', function() {
      it('inserts a client in the database', function(done) {
        var _this = this;
        var client = new Client({ 'nombre': 'John Doe' });

        this.database.storeClient(client)
          .then(function(clientFound) {
            expect(clientFound).to.not.be.null;
            client = clientFound;

            expect(client).to.have.property('id').that.is.a('string');

            _this.db.collection('clientes').findOne({
              _id: mongodb.ObjectID(client.id)
            }, function(err, result) {
              if (err) {
                done(err);
              } else {
                expect(String(result._id)).to.be.equal(client.id);
                expect(result.nombre).to.be.equal(client.nombre);
                done();
              }
            });
          })
          .catch(done);
      });
    });

    describe('#findClientById', function() {
      it('get a client by id', function(done) {
        this.database.findClientById(this.clientId)
          .then(_.bind(function(client) {
            expect(client).to.not.be.undefined;
            expect(client).to.be.an.instanceOf(Client);
            expect(client).to.have.property('id', this.id);
            expect(client).to.have.property('nombre', this.clientData.nombre);
            done();
          }, this))
          .catch(done);
      });
    });

    describe('#findClientByRFC', function() {
      it('get a client by rfc', function(done) {
        this.database.findClientByRFC(this.clientRfc)
          .then(_.bind(function(client) {
            expect(client).to.not.be.undefined;
            expect(client).to.be.an.instanceOf(Client);
            expect(client).to.have.property('id', this.id);
            expect(client).to.have.property('nombre', this.clientData.nombre);
            expect(client).to.have.property('rfc', this.clientRfc);
            done();
          }, this))
          .catch(done);
      });
    });

    describe('#deleteClient', function() {
      it('delete a client', function(done) {
        var client = new Client(_.extend(this.clientData, {
          id: this.clientId
        }));

        this.database.deleteClient(client)
          .then(_.bind(function() {
            this.db.collection('clientes').findOne({
              _id: mongodb.ObjectID(client.id)
            }, function(err, result) {
              if (err) {
                done(err);
              } else {
                expect(result).to.be.null;
                done();
              }
            });
          }, this))
          .catch(done);
      });
    });
  });

  describe('#getClients', function() {
    beforeEach(function(done) {
      var clientData = [];

      for (let i = 0; i<100; i++) {
        let rfc = 'ABC' + _.padLeft(i, 6, '0') + 'ABA';
        let numeroCliente = _.padLeft(i, 4, '0');

        clientData.push({
          nombre: 'John',
          apellidoPaterno: 'Doe',
          rfc: rfc,
          numeroCliente: numeroCliente,
          numeroCuenta: '120-001-' + numeroCliente,
          codigoPostal: '80280'
        });
      }

      this.database = new MongoDatabase(TEST_DATABASE_URL);
      this.database.ensureConnection()
        .then(_.bind(function(db) {
          this.db = db;

          // Insert mock data
          db.collection('clientes')
            .insert(clientData, _.bind(function(err) {
              if (err) {
                done(err);
              } else {
                done();
              }
            }, this));
        }, this))
        .catch(done);
    });

    afterEach(function(done) {
      this.db.collection('clientes').drop(function(err) {
        if (err) {
          if (err.errmsg === 'ns not found') {
            this.db.close();
            this.database.db.close();
            this.database.close();
            done();
          } else {
            done(err);
          }
        }
        done();
      });
    });

    it('get limited list of clients', function(done) {
      this.database.getClients()
        .then(_.bind(function(result) {
          expect(result.items).to.not.be.empty;
          expect(result.items).to.have.a.lengthOf(10);
          result.items.forEach(function(client) {
            expect(client).to.be.an.instanceOf(Client);
          });
          done();
        }, this))
        .catch(done);
    });

    it('skips the result as needed', function(done) {
      this.database.getClients({ skip: 10 })
        .then(_.bind(function(result) {
          expect(result.items).to.not.be.empty;
          // We are in the 10th element so rfc should contain a 10
          expect(result.items[0].rfc).to.be.equal('ABC000010ABA');
          done();
        }, this))
        .catch(done);
    });

    it('filter clients by rfc', function(done) {
      this.database.getClients({ rfc: 'ABC000010ABA' })
        .then(_.bind(function(result) {
          expect(result.items).to.not.be.empty;
          expect(result.items).to.have.a.lengthOf(1);
          expect(result.items[0].rfc).to.be.equal('ABC000010ABA');
          done();
        }, this))
        .catch(done);
    });

    it('filter clients by rfc in case insensitive', function(done) {
      this.database.getClients({ rfc: 'ABC000010aba' })
        .then(_.bind(function(result) {
          expect(result.items).to.not.be.empty;
          expect(result.items).to.have.a.lengthOf(1);
          expect(result.items[0].rfc).to.be.equal('ABC000010ABA');
          done();
        }, this))
        .catch(done);
    });

  });
});
