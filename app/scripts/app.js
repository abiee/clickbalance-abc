import Backbone from 'backbone';
import Marionette from 'backbone.marionette';

var App = new Marionette.Application();

App.on('before:start', function() {
  'use strict';

  $(document).on('click', 'a[href^="/"]:not([data-bypass])', function(event) {
    if (!(event.altKey || event.ctrlKey || event.metaKey || event.shiftKey)) {
      event.preventDefault();
      var href = $(event.currentTarget).attr('href');
      var url = href.replace(/^\//,'');
      App.router.navigate(url, { trigger: true });
    }
  });
});

App.on('start', function() {
  'use strict';

  App.router = new Backbone.Router();
  if (Backbone.history) {
    Backbone.history.start({ pushState: true });
  }
});

export default App;
