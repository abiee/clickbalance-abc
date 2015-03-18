export default class Services {
  constructor(database) {
    this._database = database;
  }

  getAddressByZipCode(code) {
    return this._database.getAddressByZipCode(code);
  }
}
