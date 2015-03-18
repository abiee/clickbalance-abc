/* global noty */
import _ from 'lodash';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Searchbox from 'searchbox';
import swal from 'sweetalert/lib/sweet-alert';
import 'noty/js/noty/packaged/jquery.noty.packaged';
import 'backbone-validation';

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

App.channel.comply('confirm:delete', function(message, successMessage, callback) {
  'use strict';

  message = message || 'Se eliminará la información y no podrá ser recuperada';
  successMessage = successMessage || 'Se eliminó la información con éxito';

  function showSuccess() {
    swal('¡Eliminado!', successMessage, 'success');
  }

  swal({
    title: '¿Está usted seguro?',
    text: message,
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#DD6B55',
    confirmButtonText: 'Si, eliminar',
    cancelButtonText: 'No, mantener información',
    closeOnConfirm: false
  }, function() {
    if (callback) {
      callback(showSuccess);
    } else {
      showSuccess();
    }
  });
});

App.on('before:start', function() {
  'use strict';

  App.channel.on('subapplication:started', function(name) {
    $('.main-menu li').removeClass('active');
    $('.main-menu .' + name).addClass('active');
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

App.on('before:start', function() {
  'use strict';

  _.extend(Backbone.Validation.callbacks, {
    valid: function(view, attr) {
      var $el = view.$('#' + attr);
      if ($el.length === 0) {
        $el = view.$('[name~=' + attr + ']');
      }

      // If input is inside an input group, $el is changed to
      // remove error properly
      if ($el.parent().hasClass('input-group')) {
        $el = $el.parent();
      }

      var $group = $el.closest('.form-group');
      $group.removeClass('has-error')
        .addClass('has-success');

      var $helpBlock = $el.next('.help-block');
      if ($helpBlock.length === 0) {
        $helpBlock = $el.children('.help-block');
      }
      $helpBlock.slideUp({
        done: function() {
          $helpBlock.remove();
        }
      });
    },
    invalid: function(view, attr, error) {
      var $el = view.$('#' + attr);
      if ($el.length === 0) {
        $el = view.$('[name~=' + attr + ']');
      }

      $el.focus();

      var $group = $el.closest('.form-group');
      $group.removeClass('has-success')
        .addClass('has-error');

      // If input is inside an input group $el is changed to
      // place error properly
      if ($el.parent().hasClass('input-group')) {
        $el = $el.parent();
      }

      // If error already exists and its message is different to new
      // error's message then the previous one is replaced, otherwise
      // new error is shown with a slide down animation
      if ($el.next('.help-block').length !== 0) {
        $el.next('.help-block')[0].innerText = error;
      } else if ($el.children('.help-block').length !== 0) {
        $el.children('.help-block')[0].innerText = error;
      } else {
        var $error = $('<div>')
                   .addClass('help-block')
                   .html(error)
                   .hide();

        // Placing error
        if ($el.prop('tagName') === 'div' && !$el.hasClass('input-group')) {
          $el.append($error);
        } else {
          $el.after($error);
        }

        // Showing animation on error message
        $error.slideDown();
      }
    }
  });

  _.extend(Backbone.Validation.patterns, {
    rfc: /[a-zA-Z]{3,4}[0-9]{6}[a-zA-Z0-9]{2}[A0-9]/
  });

  _.extend(Backbone.Validation.messages, {
    required: '{0} es obligatorio',
    rfc: 'R.F.C. no válido, use el formato AAAA######AAA ó AAA######AAA, ' +
         'con terminación numérica o la letra A',
    length: '{0} debe ser de exactamente {1} caracteres',
    minLength: '{0} debe tener al menos {1} caracteres'
  });
});

App.on('start', function() {
  'use strict';

  App.router = new Backbone.Router();
  if (Backbone.history) {
    Backbone.history.start({ pushState: true });
  }
});

App.on('start', function() {
  'use strict';

  var searchbox = new Searchbox();
  var region = new Marionette.Region({ el: '#search-container' });

  searchbox.on('search', function(keyword) {
    App.channel.trigger('search', keyword);
  });

  region.show(searchbox);
});

export default App;
