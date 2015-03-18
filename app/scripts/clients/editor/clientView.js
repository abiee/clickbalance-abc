import Marionette from 'backbone.marionette';
import clientViewTemplate from 'clients/editor/templates/clientView';
import 'backbone.stickit/backbone.stickit';

export default class ClientView extends Marionette.ItemView {
  constructor(...rest) {
    this.template = clientViewTemplate;
    this.className = 'panel panel-default';
    this.triggers = {
      'click button[type="submit"]': 'save:client',
      'click .delete': 'delete:client'
    };
    this.bindings = {
      '#rfc': 'rfc',
      '#nombre': 'nombre',
      '#apellido-paterno': 'apellidoPaterno',
      '#apellido-materno': 'apellidoMaterno',
      '#codigo-postal': 'codigoPostal',
      '#estado': 'estado',
      '#ciudad': 'ciudad',
      '#colonia': 'colonia',
      '#numero-cliente': 'numeroCliente',
      '#cuenta-contable': 'cuentaContable'
    };
    super(...rest);
  }

  onRender() {
    this.stickit();
  }

  serializeData() {
    var serializedData = this.model.toJSON();
    serializedData.notIsNew = !this.model.isNew();
    return serializedData;
  }
}
