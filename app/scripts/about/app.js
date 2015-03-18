import Marionette from 'backbone.marionette';
import AboutView from './aboutView';

export default class AboutApp extends Marionette.Object {
  constructor(options, ...rest) {
    this.region = options.region;
    super(options, ...rest);
  }

  showAboutInfo() {
    var view = new AboutView();
    this.region.show(view);
  }
}
