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

  showAsSearching(keyword) {
    var $el = this.$('.page-title > span');
    var $spin = $('<i>').addClass('fa fa-spinner fa-spin');

    $el.html('Buscando \'' + keyword + '\'... ').append($spin);
  }

  hideSearchigStatus() {
    var $el = this.$('.page-title > span');
    $el.html('Todos los clientes registrados');
  }
}
