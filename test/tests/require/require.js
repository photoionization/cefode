var assert = require('assert');

describe('require', function() {
  describe('behaviour', function() {
    it('type is function', function() {
      assert.equal(typeof global.require, 'function');
    });
  });

  describe('members', function() {
    it('have resolve', function() {
      assert.equal(typeof global.require.resolve, 'function');
    });

    it('have main', function() {
      assert.equal(typeof global.require.main, 'object');
    });

    it('have extensions', function() {
      assert.equal(typeof global.require.extensions, 'object');
    });

    it('have registerExtension', function() {
      assert.equal(typeof global.require.registerExtension, 'function');
    });

    it('have cache', function() {
      assert.equal(typeof global.require.cache, 'object');
    });
  });
});

