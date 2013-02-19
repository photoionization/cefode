var assert = require('assert');

describe('dom', function() {
  describe('features', function() {
    it('message channel', function(done) {
      require('fs').readFile(__filename, function() {
        var mc = new window.MessageChannel()
        mc.port1.onmessage = function(m) {
          done();
        }
        mc.port2.postMessage("HELLO");
      });
    });

    it('dedicated worker', function(done) {
      var worker = new Worker('spec/dom/worker.js');
      worker.addEventListener('message', function(e) {
        assert.equal(e.data, 'Hello World!');
        worker.terminate();
        done();
      }, false);

      worker.postMessage('Hello World!');
    });

    it('shared worker', function(done) {
      var worker = new SharedWorker('spec/dom/shared_worker.js');
      worker.port.addEventListener('message', function(e) {
        assert.equal(e.data, 'Hello World!');
        worker.port.close();
        done();
      }, false);
      worker.port.start();
    });
  });
});

