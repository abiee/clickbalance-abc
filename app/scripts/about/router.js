import App from 'app';
import Marionette from 'backbone.marionette';
import SubapplicationController from 'subapplicationController';
import AboutApp from 'about/app';

class AbourController extends SubapplicationController {
  showAbout() {
    var app = this.getAppInstance();
    app.showAboutInfo();
  }

  getAppClass() {
    return AboutApp;
  }

  getSubapplicationName() {
    return 'acerca';
  }
}

App.on('before:start', function() {
  'use strict';

  new Marionette.AppRouter({
    controller: new AbourController(),
    appRoutes: {
      'app/acerca/': 'showAbout'
    }
  });
});
