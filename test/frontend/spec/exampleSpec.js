import Backbone from 'backbone';

describe('Example of loading a JSON fixture', function() {
  'use strict';

  it('will create a model from a loaded JSON', function() {
    var loadedData = fixture.load('example.json');
    var model = new Backbone.Model(loadedData);
    expect(model.get('name')).to.equal('John Doe');
  });
});
