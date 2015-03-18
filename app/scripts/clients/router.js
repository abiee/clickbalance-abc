import Marionette from 'backbone.marionette';
import App from 'app';
import ClientsApp from 'clients/app';

class ClientsController extends Marionette.Controller {
  listClients() {
    var app = this.getAppInstance();
    app.showClientList();
  }

  showClient(clientId) {
    var app = this.getAppInstance();
    app.showClientById(clientId);
  }

  getAppInstance() {
    var app;

    if (App.currentApp instanceof ClientsApp) {
      app = App.currentApp;
    } else {
      app = new ClientsApp({
        region: new Marionette.Region({ el: '#main-container' })
      });
      App.currentApp = app;
    }

    return app;
  }
}

App.on('before:start', function() {
  'use strict';

  new Marionette.AppRouter({
    controller: new ClientsController(),
    appRoutes: {
      'app/clientes/': 'listClients',
      'app/clientes/ver/:clientId/': 'showClient'
    }
  });
});
