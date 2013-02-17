var assert = require('assert');

describe('require', function() {
  describe('behaviour', function() {
    it('type is function', function() {
      assert.equal(typeof global.require, 'function');
    });

    it('has members', function() {
      assert.equal(typeof global.require.resolve, 'function');
      assert.equal(typeof global.require.main, 'object');
      assert.equal(typeof global.require.extensions, 'object');
      assert.equal(typeof global.require.registerExtension, 'function');
      assert.equal(typeof global.require.cache, 'object');
    });
  });
});

