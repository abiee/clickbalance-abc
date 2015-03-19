import Backbone from 'backbone';
import 'backbone.radio';

export default class DefaultRouter extends Backbone.Router {
  constructor(...rest) {
    this.routes = {
      '': 'goToDefault'
    };
    super(...rest);
  }

  goToDefault() {
    this.navigate('/app/clientes/', true);
  }
}
