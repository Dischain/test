function Algorithm() {
  this._running = false;
  this._paused = false;
  this._stopped = false;
}

Algorithm.prototype.run = function(cb) {}

Algorithm.prototype.pause = function(cb) {}

Algorithm.prototype.stop = function(cb) {}

Algorithm.prototype.restart = function() {}

function clone(obj) {

  if (Array.isArray(obj)) {

    let copy = [];

    for (let i = 0; i < obj.length; i++) {

      let value = obj[i];

      copy[i] = (value !== null && typeof value === "object") ? clone(value) : value;

    }
  } else {

    let copy = {};

    for (let key in obj) {

      if (obj.hasOwnProperty(key)) {

        let value = obj[key];

        copy[key] = (value !== null && typeof value === "object") ? clone(value) : value;

      }

    }

  }

  return copy;

}

/**
 * Extends <Algorithm>
 * Not changes the initial `container`
 */

function ParallelLimited(container, limit) {
  Algorithm.call(this);
   // контейнеры отдать суперклассу
  this._container = clone(container);
  this._copyContainer =  clone(container);
  this._limit = limit;
}

/**
 * `cb` should be executed after all async tasks complete.
 */
ParallelLimited.prototype.run = function(cb) {
  let running = 1,
       curTask = this._container.next();
  function next() {
    --running;

    if (!task && running === 0) {
      cb();
    }
    // Заменить this._container.length на hasMore() в каждой коллекции (метод интерфейса)
    while(running < this._limit && this._container.length > 0) {
      (function (task) {
        task.run(next);
      })(curTask);
      curTask = this._container.next();
      running++;
    }
  }
  next();
}

Parallel.prototype.run = function(cb) {
  this._items.forEach((item, index) => {
    if (index === this._items.size()) {
      item.run(cb);
    } else {
      item.run();
    }
  });
}

Series.prototype.run = function(cb) {
  function next() {
    let curTask = this._container.next();
    if (this._container.hasNext()) {
      curTask.run(next);
    } else {
      curTask.run(cb);
    }
  }
}

// В AsyncQueue и AsyncPQ:
Async*.prototype.parallelLimited = function(limit) {
  this._algorithm = new ParallelLimited(this._tasks, limit);
  return this;
}

Async*.prototype.run = function(cb) {
  this._algorithm.run(cb);
}
