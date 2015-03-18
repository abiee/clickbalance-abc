import Marionette from 'backbone.marionette';
import listLayoutTemplate from 'clients/list/templates/listLayout';

export default class ListLayout extends Marionette.LayoutView {
  constructor(...rest) {
    this.template = listLayoutTemplate;
    this.className = 'col-xs-12';
    this.regions = {
      list: '#list-container'
    };
    super(...rest);
  }
}
