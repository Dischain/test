'use strict';

const path = require('path')
    , url  = require('url')
    , http = require('http');

// Options:
//
// cache: {Boolean} - false by default
// cacheHeaders: {String} - if not specified and if cache is true, the default max-age header 
//                          should be 3600 seconds
//
// encoding: {Boolean} - accept encoding.
// 
// cors: {Boolean}
// corsHeaders: {String}
//
// host: {String} - if not specified, default host should be `127.0.0.1`
// port: {Number} - if not specified, default port should be 3000
// root: {String} - if not specified, default path to directory is './'
// name: {String}
//
// notFound: {String} - path to default 404 answer; should be placed into the `root`folder

const defaultOpts = {
	cache: false,
	cacheHeaders: 'private, max-age=3600',
	encoding : false,
	host: '127.0.0.1',
	port: 3000,
	root: './',
	cors: false,
	corsHeaders: '',
	name: 'node.js'
}

function Server(opts) {
	if (!opts) {
		this.options = defaultOpts;
	} else {
		this.options = Object.keys(defaultOpts).reduce((init, key) => {
			if (!opts[key] || opts[key] === '') {
				init[key] = defaultOpts[key]
			} else {
				init[key] = opts[key];
			}
	
			return init;
		}, {});
	}

	this.options.root = path.resolve(path.normalize(this.options.root));
	console.log(this.options)
}

Server.prototype.start = function start(callback) {
  this._server = http.createServer(handler(this))
                     .listen(this.options.port, this.options.host, callback);
};

Server.prototype.stop = function stop() {
  if (this._server) {
    this._server.close();
    this._server = null;
  }
};

function handler(server) {
	return function(req, res) {
		let pathname  = url.parse(req.url).pathname
		  , fullPath = path.join(server.options.root, pathname);
		
		res.headers = {};
		
		if (server.options.name) {
     		res.headers['X-Powered-By'] = server.options.name;
    	}

		if (server.options.cors) {
    		res.headers['Access-Control-Allow-Origin'] = '*';
    		res.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, Range';
    		if (server.options.corsHeaders) {
      			server.options.corsHeaders.split(',')
          			.forEach((header) => { 
          				res.headers['Access-Control-Allow-Headers'] += ', ' + header; });
    		}
  		}

		getStat(fullPath).then((stat) => {			
			if (stat.isDirectory()) {
				sendFile(path.join(fullPath, 'index.html'));
			} else {
				sendFile(fullPath, stat, res, server);
			}
		}).catch((err) => {
			if (err.code = 'ENOENT') {
				sendError(res, server);
			}
		})

  		/*if (server.options.cache) {
			res.headers['Cache-Control'] = server.options.cacheHeaders;
  		}*/

		res.writeHead(200, res.headers);
		
		res.write('hello');
		res.end();
	} 
}

function sendFile() {
	res.headers['Etag']           = JSON.stringify([stat.ino, stat.size, stat.mtime.getTime()].join('-'));
    res.headers['Date']           = new Date().toUTCString();
    res.headers['Last-Modified']  = new Date(stat.mtime).toUTCString();
}

// houston
//static-server: requestHandler -> getFileStats -> sendFile(stat)
function getStat(path) {
	return new Promise((resolve, reject) => {
		require('fs').stat(path, (err, stat) => {
			if (err) return reject(err)
			resolve(stat);
		});
	});
}

function sendFile(fullPath, stat, res, serv) {
	if (serv.options.cache) {

	}
}

new Server({cache: true, cors: true, name: 'dischain-serv'}).start();
