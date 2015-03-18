import _ from 'lodash';
import App from 'app';

export default {
  deleteClient: function(client) {
    'use strict';

    App.channel.command('confirm:delete',
      `Se eliminará el cliente '${client.get('nombre')}' y ya no ` +
      'podrá ser recuperado',
      `Se eliminaró el cliente '${client.get('nombre')}' exitosamente`,
      _.bind(this._deleteClient(client), this)
    );
  },

  _deleteClient: function(client) {
    'use strict';

    return function(done) {
      client.destroy({
        success: _.bind(function() {
          if (this.onClientDeleted) {
            this.onClientDeleted();
          }
          done();
        }, this),
        error: this._showErrorNotification
      });
    };
  },

  _showErrorNotification: function() {
    'use strict';

    App.channel.command('notify', 'error', 'Ocurrió un error inesperado ' +
      'cuando se eliminaba al cliente. Intente de nuevo más tarde');
  }
};
