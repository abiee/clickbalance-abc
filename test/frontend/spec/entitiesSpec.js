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

    describe('#setAddressByZipCode', function() {
      beforeEach(function() {
        this.server = sinon.fakeServer.create();
      });

      afterEach(function() {
        this.server.restore();
      });

      it('fetchs address data from server and set the attributes', function() {
        this.server.respondWith('GET', '/api/codigo-postal/80000',
            [200, { 'Content-Type': 'application/json' },
             '{ "estado": "SIN", "ciudad": "Culiacán", "colonia": "Centro" }']);

        var client = new ClientModel({ codigoPostal: '80000' });

        client.setAddressByZipCode();
        this.server.respond();

        expect(client.get('estado')).to.be.equal('SIN');
        expect(client.get('ciudad')).to.be.equal('Culiacán');
        expect(client.get('colonia')).to.be.equal('Centro');
      });

      it('calls a success callback if finished successfully', function() {
        this.server.respondWith('GET', '/api/codigo-postal/80000',
            [200, { 'Content-Type': 'application/json' },
             '{ "estado": "SIN", "ciudad": "Culiacán", "colonia": "Centro" }']);

        var client = new ClientModel({ codigoPostal: '80000' });
        var callback = sinon.stub();

        client.setAddressByZipCode(callback);
        this.server.respond();
        expect(callback).to.have.been.calledOnce;
      });

      it('calls a fail callback if finished with errors', function() {
        this.server.respondWith('GET', '/api/codigo-postal/80000',
            [404, { 'Content-Type': 'application/json' },
             '{ "error": "Código postal no encontrado" }']);

        var client = new ClientModel({ codigoPostal: '80000' });
        var callback = sinon.stub();

        client.setAddressByZipCode(null, callback);
        this.server.respond();

        expect(callback).to.have.been.calledOnce;
        expect(callback).to.have.been.calledWith({
          error: 'Código postal no encontrado'
        });
      });

      it('unsets address if server fetch fails', function() {
        this.server.respondWith('GET', '/api/codigo-postal/80000',
            [404, { 'Content-Type': 'application/json' },
             '{ "error": "Código postal no encontrado" }']);

        var client = new ClientModel({
          estado: 'SIN',
          ciudad: 'Culiacán',
          colonia: 'Centro',
          codigoPostal: '10000'
        });

        client.setAddressByZipCode();
        this.server.respond();

        expect(client.get('estado')).to.be.undefined;
        expect(client.get('ciudad')).to.be.undefined;
        expect(client.get('colonia')).to.be.undefined;
      });
    });
  });
});
