'use strict';

/**
 * A basic Async Task, which may invoke given `asyncFunc` function with given `args` and  * `userCallback`.
 */
function AsyncTask(args, asyncFunc, userCallback) {
  this._args = args;
  this._function = asyncFunc;
  this._userCallback = userCallback;
}

/**
 * Run `asyncFunc` with given `args` and `userCallback` and finally invokes
 * some not stricltly required `finalCallback`
 *
 * @param{Function} finalCallback
 */
AsyncTask.prototype.run = function(finalCallback) {
  // This `callback` should be invoked with target async function call and it
  // contains `_userCallback` invocation at its body
  let callback = function() {
    let results = Array.prototype.slice.call(arguments);
    this._userCallback(results);
    
    if (finalCallback) finalCallback();
  };

  callback = callback.bind(this);

  // To implement this, simply append `callback` to the end arguments list
  this._args.push(callback);
  
  this._function.apply(this, this._args);
}

function PrioritisedAsyncTask(args, asyncFunc, userCallback, priority) {
  let temp = Array.prototype.slice.call(arguments); temp.pop();
  AsyncTask.apply(this, temp);

  this._priority = priority;
}

PrioritisedAsyncTask.prototype = Object.create(AsyncTask.prototype);
PrioritisedAsyncTask.prototype.constructor = PrioritisedAsyncTask;

PrioritisedAsyncTask.prototype.getPriority = function() { return this._priority; };

//-------------- Read File Example---------------------//
function read(path ,callback) {
  require('fs').readFile(path, callback);
}
function user_callback(data) { console.log(data.toString()); }
//-----------------------------------------------------------//

// AsyncTask
// let task = new AsyncTask(['test.js'], read, user_callback);
// task.run(() => { console.log('task success'); });

// PrioritisedAsyncTask
let put = new PrioritisedAsyncTask(['test.js'], read, user_callback, 1);
console.log(put.getPriority());
put.run(() => { console.log('task success'); });

// XHR Example
// let u = new UniqueTask(['/', true], xhr, () => console.log('fdf'));

// function xhr(recourse, isAsync) {
//   let x = new XMLHttpRequest();
//    x.open('GET', recourse, isAsync);
//    x.onreadystatechange = function(data) {
//      if (x.readyState ==4)
//        console.log(x.responseText); 
//    };
//
//    x.send();
// }

// Дописать в PQ, что items - экземпляры класса PrioritisedUniqueTask
// 1). Сначала инициализируется AsyncQueue или AsyncPriorityQueue.
// 2). Потом аргументы конструктора превращаются в массив AsyncTask или PrioritisedAsyncTask
// 3). После этого они отправляются в конструктор Queue либо PQ.
// 4). После инициализации тасками, вызывается один из методов, унаследованных от AsynRunner - 
//      serial, parallel и т.д. 
// 5). Затем выбранный метод инициализирует соответствующий экземпляр алгоритма путем передачи
//      ему экземпляра ранее инстанцированной Queue или PQ. Этот метод должен возвращать `this`
//      AsyncRunner`a для реализации chaining`а.
// 6). Теперь может вызвываться один из методов манипуляции асинхронным хранилищем - start(), stop(), 
//       pause(). Если алгоритм не выбран, на этих методах будет генерироваться искдючение. Так же
//       доступны предикаты running(), stoped(), paused().
