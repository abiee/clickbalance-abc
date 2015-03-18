import _ from 'lodash';
import Marionette from 'backbone.marionette';
import App from 'app';
import deleteClientMixin from '../deleteClientMixin';
import EditorLayout from './editorLayout';
import ClientView from './clientView';

export default class ClientEditor extends Marionette.Object {
  constructor(options, ...rest) {
    this.region = options.region;

    _.mixin(this, deleteClientMixin);

    super(options, ...rest);
  }

  showEditor(client) {
    var layout = new EditorLayout();
    var view = new ClientView({ model: client });

    view.on('save:client', function(data) {
      var client = data.model;
      client.save(null, {
        success: function() {
          App.router.navigate('/app/clientes/', true);
          App.channel.command('notify', 'Se guardó el cliente con éxito');
        },
        error: function() {
          App.channel.command('notify', 'error',
                              'Ocurrió un error mientras se guardaba el ' +
                              'el cliente. Intente de nuevo más tarde');
        }
      });
    });

    view.on('delete:client', _.bind(function(data) {
      var client = data.model;
      this.deleteClient(client);
    }, this));

    this.region.show(layout);
    layout.getRegion('form').show(view);
  }

  onClientDeleted() {
    App.router.navigate('/app/clientes/', true);
  }
}
