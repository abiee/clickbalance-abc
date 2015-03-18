/* global noty */
import _ from 'lodash';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import 'noty/js/noty/packaged/jquery.noty.packaged';

var App = new Marionette.Application();

App.channel.comply('notify', function(type, message) {
  'use strict';

  if (!message) {
    message = type;
    type = 'success';
  }

  // Success notifications should be closed automatically
  var timeout = type === 'success' ? 2500 : false;

  noty({
    text: message,
    type: type,
    timeout: timeout
  });
});

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

App.on('before:start', function() {
  'use strict';

  $.noty.defaults = _.extend($.noty.defaults, {
    layout: 'topRight',
    theme: 'relax',
    animation: {
      open: 'animated bounceInRight',
      close: 'animated rollOut',
      easing: 'swing',
      speed: 500
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
