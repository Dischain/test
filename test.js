## CLI usage

In order to run [node-static-server] from console, use command with next
syntax:

nss [path_to_config] | [path_to_root]

[path_to_config] - is the path to your `config.js` file, which determines
same options, as you may provide to configure server from JavaScript code.

// congig.js

module.exports = {
	root: './root',
	cache: true,
	gzip: true,
	port: 3000
}

[path-to-root] - path to your root folder, which static server should serve

Simple example:

```
nss ../myconf.js
```

In this case, you provide all nesessary data for server in `./myconf.js` file.
If no `root` field specified, the default root path should used (`./`).

```
nss ./public
```

In this case, you provide only the path to your public directory which you want
[node-static-server] serve. Default server configurations should be applied.

```
nss
```

Here [node-static-server] should run static server fully with the default configs.

'use strict';

const fs = require('fs');

function Server(opts) { this._opts = opts; }
Server.prototype.start = function() { console.log(this._opts); };

function createServer(opts) { new Server(opts).start(); }

// @returns false if no errors, true if contains errors
function checkErrors(args, output) {
	if (args.length === 1 && !fs.existsSync(args[0])) {
		output('nss: no such file or directory, ' + args[0]);

		return true;
	} else if (args.length >= 2) {
		output('nss: wrong arguments\n' + getHelpMsg());

		return true;
	} else {
		return false;	
	}
}

function getOpts(path) {
	let opts = {};

	if (fs.statSync(path).isDirectory()) {
		opts.root = path ;
	} else {
		opts = require(path);
	}

	return opts;
}

function getHelpMsg() {
	return 'nss is a simple static server based on Node.js\n'
                        + 'Syntax:\n\n'
                        + 'nss [path_to_config] | [path_to_root]\n\n'
                        + '[path-to-root]   - path to your root folder, which static server should serve\n'
                        + '[path_to_config] - is the path to your `config.js` file\n\n'
                        + '--help - print this help and exit';
}

function parseArgs(consoleArgs, output) {
	const args = Array.prototype.slice.call(consoleArgs, 1);

	if (args[0] === '--help') {
		return output(getHelpMsg());
	}

	if (!checkErrors(args, output)) {
		const opts = getOpts(args[0]);

		createServer(opts);
	}
}

// Should start server in `./root` folder 
parseArgs(['nss', './root'], console.log);

// Should start server with opts specified in `./config.js`
parseArgs(['nss', './config.js'], console.log);

// Should return `ENOENT` error 
parseArgs(['nss', './not-exists-config.js'], console.log);

// Should return wrong arguments
parseArgs(['nss', './config.js', 'blah'], console.log);
