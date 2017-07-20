'use strict';

const Algorithm = require('./algorithm.js');

/**
 * Extends <Algorithm>
 */
function Series(container) {
  Algorithm.call(this, container);
}

Series.prototype = Object.create(Algorithm.prototype);
Series.prototype.constructor = Series;

/**
 * `cb` should be executed after all async tasks complete.
 */
Series.prototype.run = function(cb) {
  console.log('running series')
  let that = this;
  function next() {
    let curTask = that._container.next();
    if (that._container.hasMore()) {
        curTask.run(next);
    } else {
        curTask.run(cb);
    }
  }
  next();
}

module.exports = Series;
