
var fs = require('fs'),
	http = require('http'),
	ws = require('ws'),
    url = require('url');

var STREAM_PORT = 8081,
	WEBSOCKET_PORT = 8082;

// WebSocket Server
var socketServer = new ws.Server({port: WEBSOCKET_PORT, perMessageDeflate: false});
socketServer.connectionCount = 0;
socketServer.on('connection', function(socket, upgradeReq) {
	socketServer.connectionCount++;
	console.log(
		'New websocket connection: ',
		(upgradeReq || socket.upgradeReq).socket.remoteAddress,
		(upgradeReq || socket.upgradeReq).headers['user-agent'],
		'('+socketServer.connectionCount+' total)'
	);
	socket.on('close', function(code, message){
		socketServer.connectionCount--;
		console.log(
			'Disconnected websocket ('+socketServer.connectionCount+' total)'
		);
	});
});
socketServer.broadcast = function(data) {
	socketServer.clients.forEach(function each(client) {
		if (client.readyState === ws.OPEN) {
			client.send(data);
		}
	});
};


// HTTP Server for incoming stream
var streamServer = http.createServer( function(request, response) {
	
	response.connection.setTimeout(0);
	console.log(
		'Stream Connected: ' +
		request.socket.remoteAddress + ':' +
		request.socket.remotePort
	);
	request.on('data', function(data){
		console.log('rcv data :' + data.length + "b");
		socketServer.broadcast(data);
		if (request.socket.recording) {
			request.socket.recording.write(data);
		}
	});
	request.on('end',function(){
		console.log('close stream');
		if (request.socket.recording) {
			request.socket.recording.close();
		}
	});
})
// Keep the socket open for streaming
streamServer.headersTimeout = 0;
streamServer.listen(STREAM_PORT);


// Just an http server to provide the web page
http.createServer(function (req, res) {
  var parsed = url.parse(req.url, true);
  var filename = "." + parsed.pathname;
  
  fs.readFile(filename, function(err, data) {
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/html'});
      return res.end("404 Not Found");
    }	
	console.log("HTTP request " + filename);
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
console.log('Waiting ws connections on ws://localhost:'+WEBSOCKET_PORT+'/');
