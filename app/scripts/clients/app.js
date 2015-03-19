import _ from 'lodash';
import Marionette from 'backbone.marionette';
import App from 'app';
import ClientList from './list/clientList';
import ClientEditor from './editor/clientEditor';
import {ClientModel,ClientCollection} from './entities';

export default class ClientsApp extends Marionette.Object {
  constructor(options, ...rest) {
    this.region = options.region;
    super(options, ...rest);
  }

  initialize() {
    this.listenTo(App.channel, 'search', this.performSearch, this);
  }

  performSearch(keyword) {
    var app = this._initializeSubapp(ClientList, this.region);
    app.showSearching(keyword);
  }

  showClientList() {
    var clients = new ClientCollection();

    clients.fetch({
      success: _.bind(function() {
        var app = this._initializeSubapp(ClientList, this.region);
        app.showList(clients);
        this.currentApp = app;
      }, this),
      fail: function() {
        App.channel.command('show:server:error');
      }
    });
  }

  showClientById(clientId) {
    var client = new ClientModel({ id: clientId });

    client.fetch({
      success: _.bind(function() {
          var app = this._initializeSubapp(ClientEditor, this.region);
          app.showEditor(client);
        }, this),
      error: function(model, jqxhr) {
        if (jqxhr.status === 404) {
          App.channel.command('show:not:found');
        } else {
          App.channel.command('show:server:error');
        }
      }
    });
  }

  showNewClient() {
    var client = new ClientModel();
    var app = this._initializeSubapp(ClientEditor, this.region);
    app.showEditor(client);
  }

  _initializeSubapp(Subapp, region) {
    if (this.currentApp && !(this.currentApp instanceof Subapp)) {
      this.currentApp.destroy();
      let app = new Subapp({ region: region });
      this.currentApp = app;
    } else if (!this.currentApp) {
      let app = new Subapp({ region: region });
      this.currentApp = app;
    }

    return this.currentApp;
  }
}
