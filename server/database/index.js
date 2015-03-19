import InMemoryDatabase from './InMemoryDatabase';

var database = new InMemoryDatabase();

database.storeZipCode('80000', {
  estado: 'SIN',
  ciudad: 'Culiacán',
  colonia: 'Centro'
});

export default database;
