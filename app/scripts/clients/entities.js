import _ from 'lodash';
import Backbone from 'backbone';

export class ClientModel extends Backbone.Model {
  constructor(...rest) {
    this.urlRoot = '/api/clientes';
    super(...rest);
  }

  fullname() {
    return _.trim(this.get('nombre') + ' ' +
                  (this.get('apellidoPaterno') || '') + ' ' +
                  (this.get('apellidoMaterno') || ''));
  }
}

export class ClientCollection extends Backbone.Collection {
  constructor(...rest) {
    this.url = '/api/clientes';
    this.model = ClientModel;
    super(...rest);
  }
}
