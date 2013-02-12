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

    it('WebWorker', function(done) {
      var worker = new Worker('tests/dom/worker.js');
      worker.addEventListener('message', function(e) {
        assert.equal(e.data, 'Hello World!');
        done();
      }, false);

      worker.postMessage('Hello World!');
    });
  });
});

