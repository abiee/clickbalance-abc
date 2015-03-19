import _ from 'lodash';
import Marionette from 'backbone.marionette';
import App from 'app';
import deleteClientMixin from '../deleteClientMixin';
import {ClientCollection} from '../entities';
import ListLayout from './listLayout';
import ClientListView from './clientListView';
import EmptyListView from './emptyListView';

export default class ClientList extends Marionette.Object {
  constructor(options) {
    this.region = options.region;
    this._resetStatus();
    _.mixin(this, deleteClientMixin);
  }

  showList(clients) {
    this.clients = clients;

    if (clients.length === 0) {
      let view = new EmptyListView();
      this.region.show(view);
    } else {
      this._showList(clients);
    }
  }

  _showList(clients) {
    var layout = new ListLayout();
    var view = new ClientListView({ collection: clients });

    view.on('childview:delete:client', _.bind(function(view, data) {
      var client = data.model;
      this.deleteClient(client);
    }, this));

    this.region.show(layout);
    layout.getRegion('list').show(view);
  }

  showSearching(keyword) {
    this._resetStatus();

    if (!this.clients) {
      this.clients = new ClientCollection();
      this._showList(this.clients);
    }

    this.region.currentView.showAsSearching(keyword);
    this.currentStatus = _.extend(this.currentStatus, { rfc: keyword });
    this.fetchSearchingData(this.currentStatus);
  }

  fetchSearchingData(data) {
    this.clients.fetch({
      data: data,
      success: _.bind(this.hideSearchigStatus, this),
      fail: function() {
        App.channel.command('notify', 'error', 'Ocurrió un error ' +
                            'inesperado mientras se realizaba la ' +
                            'búsqueda. Por favor intente de nuevo');
      }
    });
  }

  hideSearchigStatus() {
    this.region.currentView.hideSearchigStatus();
  }

  _resetStatus() {
    this.currentStatus = {
      limit: 10,
      skip: 0
    };
  }

  onDestroy() {
    this.region.reset();
  }
}
