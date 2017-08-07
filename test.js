'use strict';

const http = require('http')
        , path = require('path')
        , url    = require('url')
        , fs      = require('fs');

let publicDir = './public';
//publicDir = path.normalize(path.resolve(root || '.'));
const publicDirPath = path.resolve(publicDir);

http.createServer(function (req, res) {
  console.log(req.url);
  const reqPath = url.parse(req.url).pathname;
  console.log(reqPath);
  const reqFullPath = path.join(publicDirPath, reqPath);

  fs.exists(reqFullPath, function(exists) {
    if (!exists) { 
      res.statusCode = 404; 
      res.end(`File ${reqFullPath} not foud, mother fucker! :)`);
      return;
    }

    /*if (fs.statSync(pathName).isDirectory()) {
      reqFullPath += '/index.html';
    }*/

    fs.readFile(reqFullPath, function(err, data) {
      if (err) { res.statusCode(500); res.end(`Error getting file: ${err}`); }
      else {
        const ext  = path.parse(reqFullPath).ext;

        res.end(data);
      }
    });
  });
}).listen(3000, function() { console.log('server is now  running on port 3000'); });
