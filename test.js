'use strict'

//Test PQ
const AsyncPQ  = require('./src/async/asyncPQ.js'),
	    readFile = require('fs').readFile;

let apq = new AsyncPQ([
	[ ['./test/test1.js'], readFile, (data) => console.log(data.toString()), 0 ],
	[ ['./test/test2.js'], readFile, (data) => console.log(data.toString()), 5 ],
	[ ['./test/test3.js'], readFile, (data) => console.log(data.toString()), 2 ]
]);

//Parallel limited
//apq.parallelLimited(2).run(() => { console.log('completed'); })

//Parallel
//apq.parallel().run(() => { console.log('completed parallel'); })

//Series
//apq.serial().run(() => { console.log('completed serial'); })
