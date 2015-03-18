import {ClientModel} from 'clients/entities';

describe('Client entities', function() {
  'use strict';

  describe('ClientModel', function() {
    it('updates regimen when rfc change', function() {
      var client = new ClientModel();
      expect(client.get('regimen')).to.be.empty;

      client.set('rfc', 'ABC123456ABA');
      expect(client.get('regimen')).to.be.equal('PERSONA_FISICA');

      client.set('rfc', 'ABCD123456ABA');
      expect(client.get('regimen')).to.be.equal('PERSONA_MORAL');

      client.set('rfc', '');
      expect(client.get('regimen')).to.be.empty;
    });

    it('assigns a default \'cuenta contable\' when \'numero cliente\' changes', function() {
      var client = new ClientModel();
      expect(client.get('cuentaContable')).to.be.empty;

      client.set('numeroCliente', '0100');
      expect(client.get('cuentaContable')).to.be.equal('120-001-0100');

      client.set('numeroCliente', '');
      expect(client.get('cuentaContable')).to.be.empty;
    });
  });
});
