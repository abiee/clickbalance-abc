import _ from 'lodash';
import mongodb from 'mongodb';
import MongoClientSerializer from './MongoClientSerializer';

const DEFAULT_LIMIT = 10;
const CLIENT_COLLECTION_NAME = 'clientes';
const ZIPCODE_COLLECTION_NAME = 'codigospostales';

export default class MongoDatabase {
  constructor(url) {
    if (!url) {
      throw new Error('Specify a URL for mongo connection');
    }
    this.url = url;
  }

  storeClient(client) {
    return new Promise(_.bind(function(resolve, reject) {
      this.getCollection(CLIENT_COLLECTION_NAME)
        .then(_.bind(function(collection) {
          let serializer = this.getSerializer();
          let serializedData = serializer.serialize(client);

          if (serializedData._id) {
            let options = { upsert: true };
            let filter = { _id: serializedData._id };
            collection.update(filter, serializedData, options, function(err) {
              if (err) {
                reject(err);
              } else {
                let clonedClient = _.cloneDeep(client);
                resolve(clonedClient);
              }
            });
          } else {
            collection.insert(serializedData, function(err, result) {
              if (err) {
                reject(err);
              } else {
                let clonedClient = _.cloneDeep(client);
                clonedClient.id = String(result[0]._id);
                resolve(clonedClient);
              }
            });
          }
        }, this))
        .catch(reject);
    }, this));
  }

  getClients(filters) {
    filters = filters || {};
    var limit = filters.limit || DEFAULT_LIMIT;
    var skip = filters.skip || 0;
    var mongoFilters = {};

    if (filters.rfc && _.trim(filters.rfc) !== '') {
      let rfc = _.trim(filters.rfc);
      let regex = new RegExp(rfc, 'i');
      mongoFilters.rfc = { $regex: regex };
    }

    var _this = this;
    return new Promise(function(resolve, reject) {
      _this.getCollection(CLIENT_COLLECTION_NAME)
        .then(function(collection) {
          collection.find(mongoFilters).skip(skip).limit(limit)
            .toArray(function(err, result) {
              if (err) {
                reject(err);
              } else {
                let serializer = _this.getSerializer();
                let items = _.map(result, function(clientData) {
                  return serializer.deserialize(clientData);
                });
                resolve({
                  total: items.length,
                  items: items
                });
              }
            });
        })
        .catch(reject);
    });
  }

  findClientById(clientId) {
    var _this = this;

    return new Promise(function(resolve, reject) {
      _this._findOne({ _id: new mongodb.ObjectID(clientId) })
        .then(resolve)
        .catch(reject);
    });
  }

  findClientByRFC(rfc) {
    var _this = this;
    var regex = new RegExp(rfc, 'i');
    var mongoFilter = {
      rfc: { $regex: regex }
    };

    return new Promise(function(resolve, reject) {
      _this._findOne(mongoFilter)
        .then(resolve)
        .catch(reject);
    });
  }

  _findOne(filters) {
    var _this = this;

    return new Promise(function(resolve, reject) {
      _this.getCollection(CLIENT_COLLECTION_NAME)
        .then(function(collection) {
          collection.findOne(filters, function(err, result) {
            if (err) {
              reject(err);
            } else {
              if (!_.isNull(result)) {
                let serializer = _this.getSerializer();
                resolve(serializer.deserialize(result));
              } else {
                resolve();
              }
            }
          });
        })
        .catch(reject);
    });
  }

  deleteClient(client) {
    var _this = this;

    return new Promise(function(resolve, reject) {
      if (!client.id) {
        return resolve();
      }

      var clientId = mongodb.ObjectID(client.id);

      _this.getCollection(CLIENT_COLLECTION_NAME)
        .then(function(collection) {
          collection.remove({
            _id: clientId
          }, function(err) {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        })
        .catch(reject);
    });
  }

  storeZipCode(code, address) {
    var _this = this;

    return new Promise(function(resolve, reject) {
      _this.getCollection(ZIPCODE_COLLECTION_NAME)
        .then(function(collection) {
          let doc = _.extend(address, { _id: code });

          collection.update(doc, {upsert: true}, function(err) {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        })
        .catch(reject);
    });
  }

  getAddressByZipCode(zipcode) {
    var _this = this;

    return new Promise(function(resolve, reject) {
      _this.getCollection(ZIPCODE_COLLECTION_NAME)
        .then(function(collection) {
          collection.findOne({ _id: zipcode }, function(err, result) {
            if (err) {
              reject(err);
            } else {
              resolve(_.omit(result, '_id'));
            }
          });
        })
        .catch(reject);
    });
  }

  ensureConnection() {
    return new Promise(_.bind(function(resolve) {
      if (this._db) {
        resolve(this._db);
      } else {
        resolve(this.makeConnection());
      }
    }, this));
  }

  makeConnection() {
    var _this = this;
    return new Promise(function(resolve, reject) {
      mongodb.MongoClient.connect(_this.url, function(err, db) {
        if (err) {
          reject(err);
        } else {
          _this._db = db;
          resolve(db);
        }
      });
    });
  }

  getCollection(name) {
    var _this = this;

    return new Promise(function(resolve, reject) {
      _this.ensureConnection()
        .then(function(db) {
          resolve(db.collection(name));
        })
        .catch(reject);
    });
  }

  getSerializer() {
    return MongoClientSerializer;
  }
}
