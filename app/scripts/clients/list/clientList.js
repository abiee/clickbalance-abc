import Marionette from 'backbone.marionette';
import ListLayout from './listLayout';
import ClientListView from './clientListView';
import EmptyListView from './emptyListView';

export default class ClientList extends Marionette.Object {
  constructor(options) {
    this.region = options.region;
  }

  showList(clients) {
    if (clients.length === 0) {
      var view = new EmptyListView();
      this.region.show(view);
    } else {
      var layout = new ListLayout();
      var view = new ClientListView({ collection: clients });
      this.region.show(layout);
      layout.getRegion('list').show(view);
    }
  }
}
