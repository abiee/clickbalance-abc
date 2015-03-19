import _ from 'lodash';
import mongodb from 'mongodb';
import Client from '../models/Client';

const SYNC_ATTRIBUTES = [
  'nombre',
  'apellidoPaterno',
  'apellidoMaterno',
  'rfc',
  'regimen',
  'codigoPostal',
  'estado',
  'ciudad',
  'colonia',
  'numeroCliente',
  'cuentaContable'
];

export default class ClientSerializer {
  static serialize(client) {
    var result = {};

    _.forEach(SYNC_ATTRIBUTES, function(attr) {
      if (client[attr]) {
        result[attr] = client[attr];
      }
    });

    if (client.id) {
      result._id = mongodb.ObjectID(client.id);
    }

    return result;
  }

  static deserialize(data) {
    var clientData = {};

    _.forEach(SYNC_ATTRIBUTES, function(attr) {
      if (data[attr]) {
        clientData[attr] = data[attr];
      }
    });

    if (data._id) {
      clientData.id = String(data._id);
    }

    return new Client(clientData);
  }
}
