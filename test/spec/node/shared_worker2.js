onconnect = function(e) {
  process.binding('constants');
  process.binding('io_watcher');
  process.binding('natives');
  e.ports[0].postMessage(String(new Buffer('hello')));
  e.ports[0].close();
}
