const OUTPUT_ATTRIBUTES = [
  'id',
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

export default class ClientJSONFormatter {
  static toJSON(client) {
    var result = {};

    OUTPUT_ATTRIBUTES.forEach(function(key) {
      if (client[key]) {
        result[key] = client[key];
      }
    });

    return result;
  }
}
