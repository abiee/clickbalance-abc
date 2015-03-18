import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import clientViewTemplate from 'clients/editor/templates/clientView';
import 'backbone.stickit/backbone.stickit';
import 'backbone-validation';

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
      '#regimen': {
        observe: 'regimen',
        selectOptions: {
          collection: [{
            value: '',
            label: 'No especificado'
          },{
            value: 'PERSONA_FISICA',
            label: 'Persona física'
          }, {
            value: 'PERSONA_MORAL',
            label: 'Persona moral'
          }]
        }
      },
      '#nombre': 'nombre',
      '#apellido-paterno': 'apellidoPaterno',
      '#apellido-materno': 'apellidoMaterno',
      '#codigo-postal': 'codigoPostal',
      '#estado': {
        observe: 'estado',
        selectOptions: {
          collection: [{
            value: '',
            label: 'No especificado'
          }, {
            value: 'AGU',
            label: 'Aguascalientes'
          }, {
            value: 'BCN',
            label: 'Baja California'
          }, {
            value: 'BCS',
            label: 'Baja California Sur'
          }, {
            value: 'CAM',
            label: 'Campeche'
          }, {
            value: 'CHP',
            label: 'Chiapas'
          }, {
            value: 'CHH',
            label: 'Chiuahua'
          }, {
            value: 'COA',
            label: 'Coahuila'
          }, {
            value: 'COL',
            label: 'Colima'
          }, {
            value: 'DIF',
            label: 'Distrito Federal'
          }, {
            value: 'DUR',
            label: 'Durango'
          }, {
            value: 'GUA',
            label: 'Guanajuato'
          }, {
            value: 'GRO',
            label: 'Guerrero'
          }, {
            value: 'HID',
            label: 'Hidalgo'
          }, {
            value: 'JAL',
            label: 'Jalisco'
          }, {
            value: 'MEX',
            label: 'Estado de México'
          }, {
            value: 'MIC',
            label: 'Michoacan'
          }, {
            value: 'MOR',
            label: 'Morelos'
          }, {
            value: 'NAY',
            label: 'Nayarit'
          }, {
            value: 'NLE',
            label: 'Nuevo León'
          }, {
            value: 'OAX',
            label: 'Oaxaca'
          }, {
            value: 'PUE',
            label: 'Puebla'
          }, {
            value: 'QUE',
            label: 'Querétaro'
          }, {
            value: 'ROO',
            label: 'Quintana Roo'
          }, {
            value: 'SLP',
            label: 'San Luis Potosí'
          }, {
            value: 'SIN',
            label: 'Sinaloa'
          }, {
            value: 'SON',
            label: 'Sonora'
          }, {
            value: 'TAB',
            label: 'Tabasco'
          }, {
            value: 'TAM',
            label: 'Tamaulipas'
          }, {
            value: 'TLA',
            label: 'Tlaxcala'
          }, {
            value: 'VER',
            label: 'Veracruz'
          }, {
            value: 'YUC',
            label: 'Yucatán'
          }, {
            value: 'ZAC',
            label: 'Zacatecas'
          }]
        }
      },
      '#ciudad': 'ciudad',
      '#colonia': 'colonia',
      '#numero-cliente': 'numeroCliente',
      '#cuenta-contable': 'cuentaContable'
    };
    super(...rest);
  }

  initialize() {
    this.listenTo(this.model, 'change:regimen', this.hideShowApellidos, this);
    this.listenTo(this.model, 'change:codigoPostal', this.updateClientAddress, this);
  }

  hideShowApellidos() {
    var regimen = this.model.get('regimen');

    if (regimen === 'PERSONA_MORAL') {
      this.$('#apellido-paterno').closest('.form-group').slideUp();
      this.$('#apellido-materno').closest('.form-group').slideUp();
    } else {
      this.$('#apellido-paterno').closest('.form-group').slideDown();
      this.$('#apellido-materno').closest('.form-group').slideDown();
    }
  }

  updateClientAddress() {
    var zipCode = this.model.get('codigoPostal');

    // Fetch address information only if the zipcode is valid
    if (zipCode && zipCode.match(/[0-9]{5}/)) {
      this.model.setAddressByZipCode();
    } else {
      this.model.unsetAddress();
    }
  }

  onRender() {
    this.stickit();
    Backbone.Validation.bind(this);
  }

  serializeData() {
    var serializedData = this.model.toJSON();
    serializedData.notIsNew = !this.model.isNew();
    return serializedData;
  }

  onDestroy() {
    Backbone.Validation.unbind(this);
  }
}
