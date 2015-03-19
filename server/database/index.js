import config from 'config';
import DatabaseFactory from './DatabaseFactory';

var factory = new DatabaseFactory(config.get('database'));

export default factory.getDatabase();
