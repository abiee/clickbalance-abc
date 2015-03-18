import Marionette from 'backbone.marionette';
import emptyListViewTemplate from 'clients/list/templates/emptyListView';

export default class EmptyListView extends Marionette.ItemView {
  constructor(...rest) {
    this.template = emptyListViewTemplate;
    this.className = 'col-md-4 col-md-offset-4 col-sm-6 col-sm-offset-3 ' +
                     'text-center';
    super(...rest);
  }

  showAsSearching() {
    this.$('.fa-user-times')
      .addClass('animated wobble')
      .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
        $(this).removeClass('animated wobble');
      });
  }

  hideSearchigStatus() {
  }
}
