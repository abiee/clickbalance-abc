import _ from 'lodash';
import Client from '../../../../server/models/Client';

describe('Client', function() {
  'use strict';

  describe('#constructor', function() {
    it('initializes client data', function() {
      var clientData = {
        'nombre': 'John',
        'apellidoPaterno': 'Doe',
        'apellidoMaterno': 'X',
        'rfc': 'ABCD123456ABA',
        'regimen': 'PERSONA_FISICA',
        'codigoPostal': '80280',
        'estado': 'SIN',
        'ciudad': 'Culiacan',
        'colonia': 'Centro',
        'numeroCliente': '0100',
        'cuentaContable': '120-001-0100'
      };

      var client = new Client(clientData);

      _.forIn(clientData, function(value, key) {
        expect(client).to.have.property(key, value);
      });
    });

    it('ignores unknown fields', function() {
      var client = new Client({
        'nombre': 'John',
        'other': 'Value'
      });
      expect(client).to.not.have.property('other');
    });

    it('generates a cuentaContable if not specified', function() {
      var client = new Client({
        'nombre': 'John',
        'numeroCliente': '0100',
      });
      expect(client).to.have.property('cuentaContable', '120-001-0100');
    });
  });

  describe('#isValid', function() {
    it('is not valid if not has the required fields', function() {
      var client = new Client();
      expect(client.isValid()).to.be.false;

      client.nombre = 'John Doe';
      expect(client.isValid()).to.be.false;

      client.rfc = 'ABC123456DEF';
      expect(client.isValid()).to.be.false;
    });

    it('is valid when required fileds are filled correctly', function() {
      var client = new Client({
        nombre: 'John Doe',
        rfc: 'ABC123456DEA',
        codigoPostal: '00000',
        numeroCliente: '1000'
      });
      expect(client.isValid()).to.be.true;
    });

    it('is not valid if rfc is not valid', function() {
      var client = new Client({
        nombre: 'John Doe',
        rfc: 'ABC123456',
        codigoPostal: '00000',
        numeroCliente: '1000'
      });
      expect(client.isValid()).to.be.false;
    });

    it('should have regimen if rfc has lenght of 13', function() {
      var client = new Client({
        nombre: 'John Doe',
        rfc: 'ABCE123456EFA',
        codigoPostal: '00000',
        numeroCliente: '1000'
      });
      expect(client.isValid()).to.be.false;
      client.regimen = 'PERSONA_FISICA';
      expect(client.isValid()).to.be.true;
    });
  });

  describe('#isValidRFC', function() {
    it('returns false if rfc has not a valid lenght', function() {
      var client = new Client({ rfc: '' });
      expect(client.isValidRFC()).to.be.false;

      client.rfc = 'ABC123456DEFGH';
      expect(client.isValidRFC()).to.be.false;

      client.rfc = 'ABC123456DE';
      expect(client.isValidRFC()).to.be.false;
    });

    it('return true if rfc has the format AAA######XXX', function() {
      var client = new Client({ rfc: 'ABC123456DEA' });
      expect(client.isValidRFC()).to.be.true;
    });
  });

  describe('#isValidRegimen', function() {
    it('is false if regimen isn\'t valid', function() {
      var client = new Client();
      expect(client.isValidRegimen()).to.be.false;

      client.regimen = 'INVALID';
      expect(client.isValidRegimen()).to.be.false;
    });

    it('is true if regimen is valid', function() {
      var client = new Client({ regimen: 'PERSONA_FISICA' });
      expect(client.isValidRegimen()).to.be.true;

      client.regimen = 'PERSONA_MORAL';
      expect(client.isValidRegimen()).to.be.true;
    });
  });

  describe('#isValidCodigoPostal', function() {
    it('is false if codigoPostal is not valid', function() {
      var client = new Client();
      expect(client.isValidCodigoPostal()).to.be.false;
      client.codigoPostal = '0000';
      expect(client.isValidCodigoPostal()).to.be.false;
      client.codigoPostal = 'TEXT';
      expect(client.isValidCodigoPostal()).to.be.false;
    });

    it('is true if codigoPostal is valid', function() {
      var client = new Client({ codigoPostal: '00000' });
      expect(client.isValidCodigoPostal()).to.be.true;
      client.codigoPostal = '80280';
      expect(client.isValidCodigoPostal()).to.be.true;
    });
  });

  describe('#isValidNumeroCliente', function() {
    it('returns true if only has numbers', function() {
      var client = new Client({ numeroCliente: '000' });
      expect(client.isValidNumeroCliente()).to.be.true;
    });

    it('returns false if is not valid', function() {
      var client = new Client({ numeroCliente: 'text' });
      expect(client.isValidNumeroCliente()).to.be.false;
    });
  });
});
