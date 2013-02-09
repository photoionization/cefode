var assert = require('assert');

describe('dom', function() {
  describe('features', function() {
    it('MessageChannel', function(done) {
      var mc = new window.MessageChannel()
      mc.port1.onmessage = function(m) {
        done();
      }
      mc.port2.postMessage("HELLO");
    });
  });
});

