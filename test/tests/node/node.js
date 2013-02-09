var assert = require('assert');

describe('node', function() {
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

