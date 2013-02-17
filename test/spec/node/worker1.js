self.addEventListener('message', function(e) {
  self.postMessage(e.data + process.cwd() + process.title + __filename);
  self.close();
}, false);

