var assert = require('assert');

describe('node', function() {
  describe('dedicated workers', function() {
    it('process object', function(done) {
      var worker = new Worker('spec/node/worker1.js');
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

      var worker = new Worker('spec/node/worker2.js');
      worker.addEventListener('message', function(e) {
        assert.equal(e.data, 'Hello World!' + new Buffer('hello'));
        done();
      }, false);

      worker.postMessage('Hello World!');
    });

    it('built-in modules', function(done) {
      var worker = new Worker('spec/node/worker3.js');
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
      var worker = new SharedWorker('spec/node/shared_worker1.js');
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

      var worker = new SharedWorker('spec/node/shared_worker2.js');
      worker.port.addEventListener('message', function(e) {
        assert.equal(e.data, String(new Buffer('hello')));
        done();
      }, false);
      worker.port.start();
    });

    it('built-in modules', function(done) {
      var worker = new SharedWorker('spec/node/shared_worker3.js');
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
    var child_process = require('child_process');

    it('echo back', function(done) {
      var child = child_process.exec('echo echo back', function (error, stdout, stderr) {
        assert.equal(error, null);
        assert.equal(stdout, process.platform == 'win32' ? 'echo back\r\n' : 'echo back\n');
        assert.equal(stderr, '');
        done();
      });
    });

    it('fork not implemented', function() {
      assert.throws(function() {
        child_process.fork('fake.js');
      }, 'child_process.fork is not supported in cefode, use web workers instead.');
    });
  });

  describe('fs', function() {
    var fs = require('fs');
    var path = require('path');

    it('read self', function(done) {
      var content = fs.readFileSync(__filename, 'utf8');
      fs.readFile(__filename, 'utf8', function(err, data) {
        assert.equal(err, null);
        assert.equal(content, data);
        done();
      });
    });

    it('readfile unlink', function(done) {
      var dirName = path.resolve(__dirname, 'test-readfile-unlink'),
          fileName = path.resolve(dirName, 'test.bin');

      var buf = new Buffer(512 * 1024);
      buf.fill(42);

      try {
        fs.mkdirSync(dirName);
      } catch (e) {
        // Ignore if the directory already exists.
        if (e.code != 'EEXIST') throw e;
      }

      fs.writeFileSync(fileName, buf);

      fs.readFile(fileName, function(err, data) {
        assert.ifError(err);
        assert(data.length == buf.length);
        assert.strictEqual(buf[0], 42);

        fs.unlinkSync(fileName);
        fs.rmdirSync(dirName);
        fs.mkdirSync(dirName);
        done();
      });
    });
  });

  describe('net', function() {
    var net = require('net');

    it('ping pong', function(done) {
      var port = 20988;
      var host = 'localhost';

      var N = 10;
      var count = 0;
      var sentPongs = 0;
      var sent_final_ping = false;

      var server = net.createServer({ allowHalfOpen: true }, function(socket) {
        assert.equal(server, socket.server);
        assert.equal(1, server.connections);

        socket.setNoDelay();
        socket.timeout = 0;

        socket.setEncoding('utf8');
        socket.on('data', function(data) {
          // Since we never queue data (we're always waiting for the PING
          // before sending a pong) the writeQueueSize should always be less
          // than one message.
          assert.ok(0 <= socket.bufferSize && socket.bufferSize <= 4);

          assert.equal(true, socket.writable);
          assert.equal(true, socket.readable);
          assert.equal(true, count <= N);
          if (/PING/.exec(data)) {
            socket.write('PONG', function() {
              sentPongs++;
            });
          }
        });

        socket.on('end', function() {
          assert.equal(true, socket.writable); // because allowHalfOpen
          assert.equal(false, socket.readable);
          socket.end();
        });

        socket.on('error', function(e) {
          throw e;
        });

        socket.on('close', function() {
          assert.equal(false, socket.writable);
          assert.equal(false, socket.readable);
          socket.server.close();
        });
      });


      server.listen(port, host, function() {
        var client = net.createConnection(port, host);

        client.setEncoding('ascii');
        client.on('connect', function() {
          assert.equal(true, client.readable);
          assert.equal(true, client.writable);
          client.write('PING');
        });

        client.on('data', function(data) {
          assert.equal('PONG', data);
          count += 1;

          if (sent_final_ping) {
            assert.equal(false, client.writable);
            assert.equal(true, client.readable);
            return;
          } else {
            assert.equal(true, client.writable);
            assert.equal(true, client.readable);
          }

          if (count < N) {
            client.write('PING');
          } else {
            sent_final_ping = true;
            client.write('PING');
            client.end();
          }
        });

        client.on('close', function() {
          assert.equal(N + 1, count);
          assert.equal(N + 1, sentPongs);
          assert.equal(true, sent_final_ping);
          done();
        });

        client.on('error', function(e) {
          throw e;
        });
      });
    });

    it('after close', function(done) {
      var server = net.createServer(function(s) {
        s.end();
      });

      server.listen(20989, function() {
        var c = net.createConnection(20989);
        c.on('close', function() {
          assert.strictEqual(c._handle, null);
          closed = true;
          assert.doesNotThrow(function() {
            c.setNoDelay();
            c.setKeepAlive();
            c.bufferSize;
            c.pause();
            c.resume();
            c.address();
            c.remoteAddress;
            c.remotePort;
          });
          server.close();
          done();
        });
      });
    });
  });
});

