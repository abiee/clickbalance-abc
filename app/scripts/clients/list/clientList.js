import _ from 'lodash';
import Marionette from 'backbone.marionette';
import deleteClientMixin from '../deleteClientMixin';
import ListLayout from './listLayout';
import ClientListView from './clientListView';
import EmptyListView from './emptyListView';

export default class ClientList extends Marionette.Object {
  constructor(options) {
    this.region = options.region;
    _.mixin(this, deleteClientMixin);
  }

  showList(clients) {
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
}
