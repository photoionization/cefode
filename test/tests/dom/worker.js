self.addEventListener('message', function(e) {
  setTimeout(function() {
    self.postMessage(e.data);
    self.close();
  }, 1000);
}, false);
