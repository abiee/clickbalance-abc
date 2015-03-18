import _ from 'lodash';
import $ from 'jquery';
import Backbone from 'backbone';

export class ClientModel extends Backbone.Model {
  constructor(...rest) {
    this.urlRoot = '/api/clientes';
    this.defaults = {
      nombre: '',
      rfc: '',
      codigoPostal: '',
      numeroCliente: ''
    };
    super(...rest);
  }

  initialize() {
    this.on('change:rfc', this.updateRegimenIfNecessary, this);
    this.on('change:numeroCliente', this.setDefaultCuentaContable, this);
  }

  updateRegimenIfNecessary() {
    if (this.has('rfc')) {
      var rfc = _.trim(this.get('rfc'));

      if (rfc.length === 12) {
        this.set('regimen', 'PERSONA_FISICA');
      } else if (rfc.length === 13) {
        this.set('regimen', 'PERSONA_MORAL');
      } else {
        this.unset('regimen');
      }
    }
  }

  setDefaultCuentaContable() {
    if (this.has('numeroCliente')) {
      var numeroCliente = _.trim(this.get('numeroCliente'));

      if (numeroCliente === '') {
        this.unset('cuentaContable');
      } else {
        let prefix = this.getCuentaContablePrefix();
        this.set('cuentaContable', prefix + numeroCliente);
      }
    }
  }

  getCuentaContablePrefix() {
    return '120-001-';
  }

  validation() {
    return {
      nombre: {
        required: true,
        minLength: 3
      },
      rfc: {
        required: true,
        pattern: 'rfc'
      },
      codigoPostal: {
        required: true,
        length: 5
      },
      numeroCliente: {
        required: true,
        minLength: 2
      }
    };
  }

  fullname() {
    return _.trim(this.get('nombre') + ' ' +
                  (this.get('apellidoPaterno') || '') + ' ' +
                  (this.get('apellidoMaterno') || ''));
  }

  setAddressByZipCode(successCallback, failCallback) {
    var zipCode = this.get('codigoPostal');

    $.get(`/api/codigo-postal/${zipCode}`)
      .done(_.bind(function(response) {
        this.set('estado', response.estado);
        this.set('ciudad', response.ciudad);
        this.set('colonia', response.colonia);
        if (successCallback) {
          successCallback();
        }
      }, this))
      .fail(_.bind(function(err) {
        this.unsetAddress();
        if (failCallback) {
          let error = err.responseJSON || { error: err.responseText };
          failCallback(error);
        }
      }, this));
  }

  unsetAddress() {
    this.unset('estado');
    this.unset('ciudad');
    this.unset('colonia');
  }
}

export class ClientCollection extends Backbone.Collection {
  constructor(...rest) {
    this.url = '/api/clientes';
    this.model = ClientModel;
    super(...rest);
  }

  parse(response) {
    this.total = response.total;
    return response.items;
  }
}
