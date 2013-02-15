var assert = require('assert');

describe('node', function() {
  describe('web workers', function() {
    it('process object', function(done) {
      var worker = new Worker('tests/node/worker1.js');
      worker.addEventListener('message', function(e) {
        assert.equal(e.data, 'Hello World!' + process.cwd() + process.title);
        worker.terminate();
        done();
      }, false);

      worker.postMessage('Hello World!');
    });


    it('process binding', function(done) {
      process.binding('constants');
      process.binding('io_watcher');
      process.binding('natives');

      var worker = new Worker('tests/node/worker2.js');
      worker.addEventListener('message', function(e) {
        assert.equal(e.data, 'Hello World!');
        worker.terminate();
        done();
      }, false);

      worker.postMessage('Hello World!');
    });
  });

  describe('child_process', function() {
    var exec = require('child_process').exec;

    it('echo back', function(done) {
      var child = exec('echo echo back', function (error, stdout, stderr) {
        assert.equal(error, null);
        assert.equal(stdout, process.platform == 'win32' ? 'echo back\r\n' : 'echo back\n');
        assert.equal(stderr, '');
        done();
      });
    });
  });

  describe('fs', function() {
    var fs= require('fs');

    it('read self', function(done) {
      var content = fs.readFileSync(__filename, 'utf8');
      fs.readFile(__filename, 'utf8', function(err, data) {
        assert.equal(err, null);
        assert.equal(content, data);
        done();
      });
    });
  });
});

