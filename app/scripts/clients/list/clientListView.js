import Marionette from 'backbone.marionette';
import clientViewTemplate from 'clients/list/templates/clientView';

class ClientView extends Marionette.ItemView {
  constructor(...rest) {
    this.template = clientViewTemplate;
    this.className = 'col-xs-12 col-md-4';
    this.triggers = {
      'click .delete': 'delete:client'
    };
    super(...rest);
  }

  serializeData() {
    var serializedData = this.model.toJSON();
    serializedData.nombreCompleto = this.model.fullname();
    return serializedData;
  }
}

export default class ClientListView extends Marionette.CollectionView {
  constructor(...rest) {
    this.childView = ClientView;
    this.className = 'col-xs-12';
    super(...rest);
  }
}
