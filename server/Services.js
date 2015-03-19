import _ from 'lodash';

export class ZipCodeNotFound extends Error { }

export class Services {
  constructor(database) {
    this._database = database;
  }

  getAddressByZipCode(code) {
    return new Promise(_.bind(function(resolve, reject) {
      this._database.getAddressByZipCode(code)
        .then(function(address) {
          if (!address) {
            reject(new ZipCodeNotFound());
          } else {
            resolve(address);
          }
        });
    }, this));
  }
}
