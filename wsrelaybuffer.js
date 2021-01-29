var fs = require('fs'),
	http = require('http'),
    url = require('url');

var STREAM_PORT = 8081,
	WEBSOCKET_PORT = 8082;
	
// Chunk buffer
let buffer = [];
	
// HTTP Server for incoming stream
var streamServer = http.createServer( function(request, response) {
	
	response.connection.setTimeout(0);
	console.log(
		'Stream Connected: ' +
		request.socket.remoteAddress + ':' +
		request.socket.remotePort
	);
	request.on('data', function(data){
		//console.log('rcv data :' + data.length + "b");
		console.log("buffer size " + buffer.length + ", data.lengh=" + data.length);
		buffer.push(data);
	});
	/*request.on('end',function(){
		console.log('close');
	});*/
})
// Keep the socket open for streaming
streamServer.headersTimeout = 0;
streamServer.listen(STREAM_PORT);


http.createServer(function (req, res) {
  var parsed = url.parse(req.url, true);
  var filename = "." + parsed.pathname;
  
  if(filename.endsWith("video")){		  
	var chunk = buffer.shift();
	res.write(chunk);	
	return res.end();
  }  
  
  fs.readFile(filename, function(err, data) {
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/html'});
      return res.end("404 Not Found");
    }
	
	console.log("Req " + filename);
	if(filename.endsWith("html"))
		res.writeHead(200, {'Content-Type': 'text/html'});
	if(filename.endsWith("wasm"))
		res.writeHead(200, {'Content-Type': 'application/wasm'});
    res.write(data);
    return res.end();
  });
}).listen(8080);
console.log("Copy in your browser http://localhost:8080/");
console.log('Listening for incomming http stream on http://localhost:'+STREAM_PORT+'/');
