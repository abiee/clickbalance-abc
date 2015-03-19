import MongoClientSerializer from '../../../../server/database/MongoClientSerializer';
import Client from '../../../../server/models/Client';

describe('MongoClientSerializer', function() {
  'use strict';

  describe('#serialize', function() {
    it('serializes client object into a plain json', function() {
      var client = new Client({
        nombre: 'John',
        apellidoPaterno: 'Doe',
        numeroCliente: '100',
        rfc: 'ABC123456789ABA'
      });

      var result = MongoClientSerializer.serialize(client);

      expect(result).to.be.deep.equal({
        apellidoPaterno: 'Doe',
        cuentaContable: '120-001-100',
        nombre: 'John',
        numeroCliente: '100',
        rfc: 'ABC123456789ABA'
      });
      expect(result).not.be.equal(client);
    });
  });

  describe('#deserialize', function() {
    it('creates a Client objec with mongo record', function() {
      var mockRecord = {
        _id: '123',
        nombre: 'John',
        apellidoPaterno: 'Doe',
        numeroCliente: '100',
        rfc: 'ABC123456789ABA'
      };

      var result = MongoClientSerializer.deserialize(mockRecord);

      expect(result).to.be.deep.equal({
        id: '123',
        apellidoPaterno: 'Doe',
        cuentaContable: '120-001-100',
        nombre: 'John',
        numeroCliente: '100',
        rfc: 'ABC123456789ABA'
      });
      expect(result).to.be.an.instanceOf(Client);
    });
  });
});
