import Marionette from 'backbone.marionette';
import aboutTemplate from 'about/templates/aboutView';

export default class AboutView extends Marionette.ItemView {
  constructor(...rest) {
    this.template = aboutTemplate;
    this.className = 'padding-md';
    super(...rest);
  }
}
