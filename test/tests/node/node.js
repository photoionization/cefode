var assert = require('assert');

describe('node', function() {
  describe('dedicated workers', function() {
    it('process object', function(done) {
      var worker = new Worker('tests/node/worker1.js');
      worker.addEventListener('message', function(e) {
        var script_path = require('path').join(__dirname, 'worker1.js');
        assert.equal(e.data, 'Hello World!' + process.cwd() + process.title + script_path);
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
        assert.equal(e.data, 'Hello World!' + new Buffer('hello'));
        done();
      }, false);

      worker.postMessage('Hello World!');
    });

    it('built-in modules', function(done) {
      var worker = new Worker('tests/node/worker3.js');
      worker.addEventListener('message', function(e) {
        var content = require('fs').readFileSync(__filename, 'utf8');
        assert.equal(e.data, content);
        done();
      }, false);
      worker.postMessage(__filename);
    });
  });

  describe('shared workers', function() {
    it('process object', function(done) {
      var worker = new SharedWorker('tests/node/shared_worker1.js');
      worker.port.addEventListener('message', function(e) {
        var script_path = require('path').join(__dirname, 'shared_worker1.js');
        assert.equal(e.data, process.cwd() + script_path);
        done();
      }, false);
      worker.port.start();
    });

    it('process binding', function(done) {
      process.binding('constants');
      process.binding('io_watcher');
      process.binding('natives');

      var worker = new SharedWorker('tests/node/shared_worker2.js');
      worker.port.addEventListener('message', function(e) {
        assert.equal(e.data, String(new Buffer('hello')));
        done();
      }, false);
      worker.port.start();
    });

    it('built-in modules', function(done) {
      var worker = new SharedWorker('tests/node/shared_worker3.js');
      worker.port.addEventListener('message', function(e) {
        var content = require('fs').readFileSync(__filename, 'utf8');
        assert.equal(e.data, content);
        done();
      }, false);
      worker.port.start();
      worker.port.postMessage(__filename);
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

