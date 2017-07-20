'use strict';

const Algorithm = require('./algorithm.js');

/**
 * Extends <Algorithm>
 */
function Parallel(container) {
  Algorithm.call(this, container);
}

Parallel.prototype = Object.create(Algorithm.prototype);
Parallel.prototype.constructor = Parallel;

/**
 * `cb` should be executed after all async tasks complete.
 */
Parallel.prototype.run = function(cb) {
  console.log('running parallel')
  let that = this;
  this._container.forEach(function(item, index) {
    if (index === that._container.size() - 1) {
      item.run(cb);
    } else {
      item.run();
    }
  });
}

module.exports = Parallel;
