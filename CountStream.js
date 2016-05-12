'use strict';

var stream = require('stream');

class CountStream extends stream.Transform {
  /**
   * @see {@link Transform}
   * @param {object} [options]
   */
  constructor(options) {
    super(options);
    this._bytes = 0;
  }

  _transform(chunk, encoding, cb) {
    var buf = chunk instanceof Buffer ? chunk : new Buffer(chunk, encoding);
    this._bytes += buf.length;
    if (this.push(buf)) {
      setImmediate(cb);
    }
  }

  /**
   * Returns the number of bytes that have been read so far.
   * @returns {number}
     */
  get count() {
    return this._bytes;
  }
}

module.exports = CountStream;
