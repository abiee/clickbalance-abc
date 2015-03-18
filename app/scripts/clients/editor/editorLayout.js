import Marionette from 'backbone.marionette';
import editorLayoutTemplate from 'clients/editor/templates/editorLayout';

export default class EditorLayout extends Marionette.LayoutView {
  constructor(...rest) {
    this.template = editorLayoutTemplate;
    this.className = 'padding-md';
    this.regions = {
      form: '#form-container'
    };
    super(...rest);
  }
}
