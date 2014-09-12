var express = require('express');
var http = require('http');
var net = require('net');
var parser = require('body-parser');
var cache = require('lru-cache');
var request = require('request');
var program = require('commander');

program
	.option('-r, --reverse [reverse]', 'reverse proxy')
	.option('-f, --forward', 'forward proxy')
	.option('-p, --port [port]', 'port', 8080)
	.option('-d, --debug', 'debug', false)
	.parse(process.argv);

var app = express();
app.use(parser.json());
app.use(parser.urlencoded({ extended: false }));

app.use('/*', function(req, res) {
	var url = '';
	if(program.reverse) {
		url = program.reverse + req.baseUrl;
	}
	else {
		url = req.originalUrl;
	}
	if(program.debug) {
		console.log(req.method, url)
		if(req.method == 'POST') {
			console.log(req.headers);
			console.log(req.body);
		}
	}
	var x = request({
		method: req.method.toLowerCase(),
		url: url,
		body: req.method == 'POST' && JSON.stringify(req.body)
	});
	try {
		req.pipe(x);
		x.pipe(res);
	} catch(e) {
		console.log(e);
	}
});
var server = http.createServer(app).listen(program.port);
server.addListener('connect', function(req, socket, bodyhead) {
	var proxy = new net.Socket();
	var hostport = req.url.split(":");
	proxy.connect(hostport[1], hostport[0], function() {
		if(program.debug) {
			console.log(req.url);
			console.log(req.headers);
		}
		socket.write("HTTP/" + req.httpVersion + " 200 Connection established\r\n\r\n");
		proxy.pipe(socket);
	});
	socket.pipe(proxy);
	
});
console.log('proxy server listen on port ' + program.port);
if(program.debug)
	console.log('debug mode');
