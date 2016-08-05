var http = require("http");

var server = http.createServer(function (request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.end("Sorry but you dun SEG-FAULTEDED!!!!\n");
});

server.listen(3000);
