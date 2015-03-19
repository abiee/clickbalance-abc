import Marionette from 'backbone.marionette';
import notFoundViewTemplate from 'templates/notFoundView';

export default class NotFoundView extends Marionette.ItemView {
  constructor(...rest) {
    this.template = notFoundViewTemplate;
    super(...rest);
  }
}
