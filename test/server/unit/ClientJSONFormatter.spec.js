import Client from '../../../server/models/Client';
import ClientJSONFormatter from '../../../server/ClientJSONFormatter';

describe('ClientJSONFormatter', function() {
  'use strict';

  describe('#toJSON', function() {
    it('converts a Client object into a plain JSON', function() {
    var client = new Client({
      nombre: 'John',
      apellidoPaterno: 'Doe',
      rfc: 'ABC123456ABA',
      codigoPostal: '80280',
      numeroCliente: '0100'
    });

    var expectedJSON = {
      nombre: 'John',
      apellidoPaterno: 'Doe',
      rfc: 'ABC123456ABA',
      codigoPostal: '80280',
      numeroCliente: '0100',
      cuentaContable: '120-001-0100'
    };

    expect(ClientJSONFormatter.toJSON(client)).to.be.deep.equal(expectedJSON);
    });
  });
});
