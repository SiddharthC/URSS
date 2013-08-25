var http = require('http');
var url = require('url');

function start(route, handle) {

  function onRequest(request, response) {
    var pathname = url.parse(request.url).pathname;
    console.log("server: Request for " + pathname + " received");
    route(handle, pathname, response, request);

  }

  var server = http.createServer(onRequest);
  server.listen(8888);
  console.log("Server has started\nGo to http://localhost:8888/");
}

exports.start = start;
