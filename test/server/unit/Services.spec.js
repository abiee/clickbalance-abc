import InMemoryDatabase from '../../../server/database/InMemoryDatabase';
import Services from '../../../server/Services';

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

    it('returns null if zip code is not found', function() {
      expect(this.services.getAddressByZipCode('00000')).to.be.undefined;
    });

    it('returns an object with address description if found', function() {
      expect(this.services.getAddressByZipCode('80000')).to.not.be.null;
    });
  });
});
