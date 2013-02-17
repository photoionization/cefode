onconnect = function(e) {
  var port = e.ports[0];
  port.onmessage = function(e) {
    require('fs').readFile(e.data, 'utf8', function(err, data) {
      port.postMessage(data);
      port.close();
    });
  };
}

