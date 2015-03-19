import InMemoryDatabase from './InMemoryDatabase';
import MongoDatabase from './MongoDatabase';

export default class DatabaseFactory {
  constructor(config) {
    this.config = config;
  }

  getDatabase() {
    if (!this._instance) {
      switch(this.config.client) {
        case 'memory':
          this._instance = this._buildMemoryDatabase();
          break;
        case 'mongo':
          this._instance = this._buildMongoDatabase(this.config);
          break;
        default:
          throw new Error('Database client \'' + this.config.client + '\' ' +
                          'not supported, please use \'memory\' or \'mongo\'');
      }
    }

    return this._instance;
  }

  _buildMemoryDatabase() {
    var database = new InMemoryDatabase();

    database.storeZipCode('80000', {
      estado: 'SIN',
      ciudad: 'Culiacán',
      colonia: 'Centro'
    });

    return database;
  }

  _buildMongoDatabase(config) {
    return new MongoDatabase(config.url);
  }
}
