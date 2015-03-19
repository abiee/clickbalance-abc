import Marionette from 'backbone.marionette';
import serverErrorViewTemplate from 'templates/serverErrorView';

export default class ServerErrorView extends Marionette.ItemView {
  constructor(...rest) {
    this.template = serverErrorViewTemplate;
    super(...rest);
  }
}
