import Marionette from 'backbone.marionette';
import searchboxTemplate from 'templates/searchbox';

const ENTER_KEY = 13;

export default class Searchbox extends Marionette.ItemView {
  constructor(...rest) {
    this.template = searchboxTemplate;
    this.className = 'search-block';
    this.events = {
      'click button': 'startSearch',
      'keypress input': 'startSearchOnEnter'
    };
    this.ui = {
      input: 'input'
    };
    super(...rest);
  }

  startSearch(evt) {
    evt.preventDefault();
    this._triggerSearch();
  }

  startSearchOnEnter(evt) {
    if (evt.keyCode === ENTER_KEY) {
      this._triggerSearch();
    }
  }

  _triggerSearch() {
    var keyword = this.ui.input.val();
    this.trigger('search', keyword);
  }
}
