import {Services,ZipCodeNotFound} from '../Services';
import database from '../database';

var services = new Services(database);

module.exports = function(app, logger) {
  'use strict';

  app.get('/api/codigo-postal/:code', function(req, res) {
    var code = req.params.code;
  
    services.getAddressByZipCode(code)
      .then(function(address) {
        res.json(address);
      })
      .catch(function(err) {
        if (err instanceof ZipCodeNotFound) {
          res.status(404).json({ error: 'Código postal no encontrado' });
        } else {
          res.status(500).json({ error: 'Error interno del servidor' });
          logger.log('error', err);
        }
      });
  });
};
