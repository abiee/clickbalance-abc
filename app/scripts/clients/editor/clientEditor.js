import Marionette from 'backbone.marionette';
import App from 'app';
import EditorLayout from './editorLayout';
import ClientView from './clientView';

export default class ClientEditor extends Marionette.Object {
  constructor(options) {
    this.region = options.region;
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

    this.region.show(layout);
    layout.getRegion('form').show(view);
  }
}
