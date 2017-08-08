'use strict';

const methods = ['GET', 'HEAD'];

const HTTP_STATUS_OK = 200,
      HTTP_STATUS_ERR = 500,
      HTTP_STATUS_BAD_REQUEST = 400,
	  HTTP_STATUS_FORBIDDEN = 403,
      HTTP_STATUS_NOT_FOUND = 404,
      HTTP_STATUS_INVALID_METHOD = 405,
      // can not send a response which is acceptable according to the 'Accept-Encoding' header
      HTTP_STATUS_NOT_ACCEPTABLE = 406; 

/**
 * Create a new instance of Server class
 *
 * Configs are:
 *	- root
 *	- host
 *	- port
 *	- name
 * 	- cache
 *	- safe
 *	- cors
 *	- gzip
 *	- log: {Function}
 */
function Server (configs) {
	this.rootPath = path.resolve(options.rootPath);
}

function sendFile(file, req, res) {

}

function gzipData(data, req, res) {
	let acceptEncoding = req.headers['Accept-Encoding'];

}

/**
 * This function pasre the 'Accept-Encoding' header field and return according to 
 * RFC 2616 section 14.3 algorithm
 */
function getEncoding(acceptEncoding) {
	let codings = acceptEncoding.split(',');

	let preferableEncoding;

	// Handle empty field-value
	if (coreturndings.length === 0) {
		preferableEncoding = 'identity';
	} 
	else if (codings.length === 1) {
		const coding = codings[0];
		// Handle matching any content-coding by single "*" symbol
		if (coding === '*') {
			preferableEncoding = 'identity';
		} 
		// Hdnle case when single content-coding restricts 'identity'
		else if (coding.split(';')[0] === '*' && coding.split(';')[1] === 'q=0') {
			preferableEncoding = 'gzip';
		}
	}
	// Handle multiple codings
	else {
		let mostQValueCodingObj = codings.reduce((init, item) => {
			const keyval = item.split(';')
			const curCoding = keyval[0],
				  curQ = parseFloat(keyval[1].slice(2));

			if (init.q < curQ)
				return init = {
					coding: curCoding,
					q: curQ
				};
			else 
				return init;
			
		}, {coding: '', q: 0});

		 preferableEncoding = mostQValueCodingObj.coding;
	}

	// If the content-coding accompanied by a qvalue of 0 - it is not acceptable

	// If special "*" symbol occures, then use default `identity` encoding

	// If multiple content-codings are acceptable, then the acceptable content-coding 
	// with the highest non-zero qvalue is preferred

	// If the field includes "*;q=0" and does not explicitly include the "identity" 
	// content-coding, then its refused. If the `Accept-Encoding` field-value is empty, 
	// then only the `identity` encoding is acceptable.
  
  return preferableEncoding;
}

function get(arr) {
    let mostQValueCodingObj = arr.reduce((init, item) => {
			const keyval = item.split(';')
			const curCoding = keyval[0],
				  curQ = parseFloat(keyval[1].slice(2));

			if (init.q < curQ)
				return init = {
					coding: curCoding,
					q: curQ
				};
			else 
				return init;
			
		}, {coding: '', q: 0});

		return mostQValueCodingObj.coding;
}
get('gzip;q=1.0, identity; q=0.5, *;q=0'.split(','))
