describe('crashes', function() {
  describe('context', function() {
    it('process.nextTick', function(done) {
      process.nextTick(done);
    });

    it('setTimeout in fs callback', function(done) {
      require('fs').readFile(__filename, function() {
        setTimeout(done, 0);
      });
    });
  });
});

