self.addEventListener('message', function(e) {
  process.binding('constants');
  process.binding('io_watcher');
  process.binding('natives');

  self.postMessage(e.data + new Buffer('hello'));
  self.close();
}, false);

