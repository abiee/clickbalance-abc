import Marionette from 'backbone.marionette';
import ListLayout from './listLayout';
import ClientListView from './clientListView';

export default class ClientList extends Marionette.Object {
  constructor(options) {
    this.region = options.region;
  }

  showList(clients) {
    var layout = new ListLayout();
    var view = new ClientListView({ collection: clients });
    this.region.show(layout);
    layout.getRegion('list').show(view);
  }
}
