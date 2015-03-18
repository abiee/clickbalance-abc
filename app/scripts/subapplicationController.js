import Marionette from 'backbone.marionette';
import App from 'app';

export default class SubapplicationController extends Marionette.Controller {
  getAppInstance() {
    var app;
    var Subapplication = this.getAppClass();

    if (App.currentApp instanceof Subapplication) {
      app = App.currentApp;
    } else {
      app = new Subapplication({
        region: new Marionette.Region({ el: '#main-container' })
      });
      App.currentApp = app;
      App.channel.trigger('subapplication:started', this.getSubapplicationName());
    }

    return app;
  }

  getAppClass() {
    return Marionette.Object;
  }

  getSubapplicationName() {
    return '';
  }
}
