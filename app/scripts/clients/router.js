import Marionette from 'backbone.marionette';
import App from 'app';
import SubapplicationController from 'subapplicationController';
import ClientsApp from 'clients/app';

class ClientsController extends SubapplicationController
 {
  listClients() {
    var app = this.getAppInstance();
    app.showClientList();
  }

  showClient(clientId) {
    var app = this.getAppInstance();
    app.showClientById(clientId);
  }

  showNewClient() {
    var app = this.getAppInstance();
    app.showNewClient();
  }

  getAppClass() {
    return ClientsApp;
  }

  getSubapplicationName() {
    return 'clientes';
  }
}

App.on('before:start', function() {
  'use strict';

  new Marionette.AppRouter({
    controller: new ClientsController(),
    appRoutes: {
      'app/clientes/': 'listClients',
      'app/clientes/ver/:clientId/': 'showClient',
      'app/clientes/nuevo/': 'showNewClient'
    }
  });
});
