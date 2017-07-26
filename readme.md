
# [nora.js](https://github.com/Dischain/nora.js)

[nora.js](https://github.com/Dischain/nora.js) is a utility module which provides queues of async javascript tasks for working with asynchromouse JavaScript, designed for use with [Node.js](https://nodejs.org)

`nora` package provides two public classes - `AsyncQueue` и `AsyncPQ`,  extended from common superclass `AsyncRunner`, which provides convenient selection method of necessary type of tasks execution (such as [series](#Series), [parallel](#Parallel), [parallel limited](#Parallel-Limited)), `run` function for async functions execution and simple [predicates](#Predicates) as `running()` and `completed()`.

Quick example:
```javascript
const AsyncQueue = require('nora').AsyncQueue,
      readFile   = require('fs').readFile;
      
let myAsyncQueue = new AsyncQueue(['file1.txt', 'file2.txt' /*, lot of files*/],
				  'utf-8', 
				  readFile, 
				  (data) => console.log(data));

myAsyncQueue
  .parallelLimited(2 /*tasks at time*/)
  .run(() => console.log('Complete!');
```
## Contents:
1. [Asynchronouse Queues](https://github.com/Dischain/test/new/master#asynchronouse-queues)
- [AsyncQueue](https://github.com/Dischain/test/new/master#asyncqueue)
- [AsyncPQ](https://github.com/Dischain/test/new/master#asyncpq)
2. [Algorithms](https://github.com/Dischain/test/new/master#algorithms)
- [Series](#Series)
- [Parallel](#Parallel)
- [Parallel Limited](#Parallel-Limited)
3. [Predicates](#Predicates)



## Asynchronouse Queues
### AsyncQueue
`AsyncQueue` represents a simplequeue, which consists of set of async tasks. You can use it in two ways:

1). Specify an array of `recourses`, which should be used as general target, array of additional arguments`additionalArgs`, an asynchronouse function `asyncFunc` and a callback function `cb`:

```AsyncQueue(recourses, additionalArgs, asyncFunc, cb)```

In this case, you specify only a one async function with additional paramaters and a callback for it, which should be applied to every recourse from `recourses` array.

Example usage:
```javascript
 let aq = new AsyncQueue(['file1.dat', 'file2.dat', 'file3.dat'],                         // recourses
						 'utf-8',                                 // additionalArgs
						 require('fs').readFile,                  // asyncFunc
						 (data) => console.log(data.toString())); // cb
```
At this example standart `node.js` `readFile` function applying to each path to file from array `['file.dat', 'file2.dat', 'file3.dat']` with additional argument `utf-8` as the file encoding and a callback, which converts a binary data to a simple string.

2). Specify an array of `tasks`, where each item consists of an array of arguments `args` for our async function, asynchronouse function `asyncfunc` and a callback `cb`:

```AsyncQueue(tasks)```

Example usage:

```javascript
let aq = new AsyncQueue([
  [ 
    ['file.dat', 'utf-8'],                 // args
    fs.readFile,                           // asyncFunc
    (data) => console.log(data.toString()) // cb
  ],
  // another tasks
  [ ['file.dat'], fs.stat, (stats) => console.log(stats.isFile())],
  [ ['somedir', {encoding: 'buffer'}], fs.readDir, (files) => console.log(files.toString())]
]);
```

### AsyncPQ
`AsyncPQ` is a priority queue, which consists of set of async tasks with corresponding execution priority. So when execution is fired, the next task at queue should has a bigger priority, then every next task.

To use this type of queue, specify an array of `tasks`, where each item consists of an array of arguments `args` for our async function, asynchronouse function `asyncfunc`, a callback `cb` and priotrity for this task:

```AsyncPQ(tasks)```

Example usage:
```javascript
let apq = new AsyncQueue([
  [ 
    ['file.dat', 'utf-8'],                  // args
    fs.readFile,                            // asyncFunc
    (data) => console.log(data.toString()), // cb
    3                                       // priority
  ],
  // another tasks
  [ ['file.dat'], fs.stat, (stats) => console.log(stats.isFile()), 1],
  [ ['somedir', {encoding: 'buffer'}], fs.readDir, (files) => console.log(files.toString()), 4]
]);
```
## Algorithms

Before you start your asynchronouse flow, you must to specify the type of tasks execution. This can be done by specifying the proper algorithm as shown below:
```javascript
myAsyncQueue.<typeOfAlgorithm()>.run(callback);
```
where `run(callback)` function starts the execution of async tasks and executes the `callback` after all tasks done.
Available algorithms are shown below.

### Series
Runs all queued tasks by only one at time. The order of execution corresponds to  used queue type (see [AsyncQueue](#AsyncQueue), [AsyncPQ](#AsyncPQ))

Example usage:
```javascript
myAsyncQueue.series().run(callback);
```

### Parallel
Runs all queued tasks in full parallel.

Example usage:
```javascript
myAsyncQueue.parallel().run(callback);
```

### Parallel Limited
Runs all queued tasks in parallel, but the number of simultaneously executed tasks limited by `limit`.

Example usage:
```javascript
myAsyncQueue.parallelLimited(limit).run(callback);
```
## Predicates
#### `running()`
Returns true, if current async queue is now on executing stored tasks.

```javascript
myAsyncQueue.parallel().run(() => {
  console.log(myAsyncQueue.running()); // 'true'
});
```

#### `completed()`
Returns true, if current async queue is now completed an execution of all stored tasks.
```javascript
myAsyncQueue.parallel().run(() => {
  console.log(myAsyncQueue.completed()); // 'false'
});
// ...long time ago
console.log(myAsyncQueue.completed()); // 'true'
```
