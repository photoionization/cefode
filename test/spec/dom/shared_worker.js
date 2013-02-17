onconnect = function(e) {
  setTimeout(function() {
    e.ports[0].postMessage('Hello World!');
    e.ports[0].close();
  }, 10);
}
