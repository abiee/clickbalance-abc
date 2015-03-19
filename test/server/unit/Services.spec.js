import InMemoryDatabase from '../../../server/database/InMemoryDatabase';
import {Services,ZipCodeNotFound} from '../../../server/Services';

describe('Services', function() {
  'use strict';

  describe('#getAddressByZipCode', function() {
    beforeEach(function() {
      this.database = new InMemoryDatabase();
      this.services = new Services(this.database);
      this.database.storeZipCode('80000', {
        estado: 'SIN',
        ciudad: 'Culiacán',
        colonia: 'Centro'
      });
    });

    it('fails if zip code is not found', function(done) {
      this.services.getAddressByZipCode('00000')
        .catch(function(err) {
          expect(err).to.be.an.instanceOf(ZipCodeNotFound);
          done();
        });
    });

    it('returns an object with address description if found', function(done) {
      this.services.getAddressByZipCode('80000')
        .then(function(address) {
          expect(address).to.not.be.empty;
          expect(address).to.have.property('estado', 'SIN');
          expect(address).to.have.property('ciudad', 'Culiacán');
          expect(address).to.have.property('colonia', 'Centro');
          done();
        })
        .catch(function(err) {
          done(err);
        });
    });
  });
});
