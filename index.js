/**
 * index.js
 * Main module file that exposes the Unlock API interface.
 */

// Expose unlock class
var Unlock = require('./unlock.js');

// Expose interface to use methods without instantiation
var instance = new Unlock();
for(var key in instance) {
  exports[key] = instance[key];
}

exports.Class = Unlock;