import _ from 'lodash';

const CLIENT_ATTRIBTES = [
  'id',
  'nombre',
  'apellidoPaterno',
  'apellidoMaterno',
  'rfc',
  'regimen',
  'codigoPostal',
  'estado',
  'ciudad',
  'colonia',
  'numeroCliente',
  'cuentaContable'
];

export default class Client {
  constructor(data) {
    data = data || {};
    _.forIn(data, _.bind(function(value, key) {
      if (_.indexOf(CLIENT_ATTRIBTES, key) >= 0) {
        this[key] = value;
      }
    }, this));

    if (!this.cuentaContable) {
      this.generateAccountNumber();
    }
  }

  generateAccountNumber() {
    this.cuentaContable = this.getAccountPrefix() + '-' + this.numeroCliente;
  }

  getAccountPrefix() {
    return '120-001';
  }

  isValid() {
    if (this.rfc && this.isValidRFC() && this.nombre && this.codigoPostal &&
        this.numeroCliente && this.isValidNumeroCliente()) {
      if (this.rfc.length === 13 && !this.regimen) {
        return false;
      }

      return true;
    }

    return false;
  }

  isValidRFC() {
    if (!this.rfc) {
      return false;
    }

    return this.rfc.match(/[a-zA-Z]{3,4}[0-9]{6}[a-zA-Z0-9]{2}[A0-9]/) !== null;
  }

  isValidRegimen() {
    if (!this.regimen) {
      return false;
    }

    return this.regimen.match(/PERSONA_FISICA|PERSONA_MORAL/) !== null;
  }

  isValidCodigoPostal() {
    if (!this.codigoPostal) {
      return false;
    }

    return this.codigoPostal.match(/[0-9]{5}/) !== null;
  }

  isValidNumeroCliente() {
    if (!this.numeroCliente) {
      return false;
    }

    return this.numeroCliente.match(/[0-9]/) !== null;
  }
}
