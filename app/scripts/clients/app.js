import _ from 'lodash';
import Marionette from 'backbone.marionette';
import App from 'app';
import ClientList from './list/clientList';
import ClientEditor from './editor/clientEditor';
import {ClientModel,ClientCollection} from './entities';

export default class ClientsApp extends Marionette.Object {
  constructor(options) {
    this.region = options.region;
  }

  showClientList() {
    var clients = new ClientCollection();

    clients.fetch({
      success: _.bind(function() {
        var app = new ClientList({ region: this.region });
        app.showList(clients);
      }, this)
    });
  }

  showClientById(clientId) {
    var client = new ClientModel({ id: clientId });

    client.fetch({
      success: _.bind(function() {
          var app = new ClientEditor({ region: this.region });
          app.showEditor(client);
        }, this),
      error: function() {
        App.channel.command('notify', 'error',
                            'Ocurrió un error con el servidor. Intente de' +
                            'nuevo más tarde');
      }
    });
  }
}
