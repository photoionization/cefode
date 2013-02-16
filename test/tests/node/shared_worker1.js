onconnect = function(e) {
  e.ports[0].postMessage(process.cwd() + __filename);
  e.ports[0].close();
}

