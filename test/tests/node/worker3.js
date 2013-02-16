self.addEventListener('message', function(e) {
  require('fs').readFile(e.data, 'utf8', function(err, data) {
    self.postMessage(data);
    self.close();
  });
}, false);

