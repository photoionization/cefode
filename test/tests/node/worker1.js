self.addEventListener('message', function(e) {
  self.postMessage(e.data + process.cwd() + process.title);
  self.close();
}, false);

