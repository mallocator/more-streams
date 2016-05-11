'use strict';

var stream = require('stream');


/**
 * A stream that will offset data by a given number of bytes off the start and end. This stream will convert any incoming
 * chunk to {@link Buffer}s and pass them on like that, if they aren't already buffers to begin with.
 */
class OffsetStream extends stream.Transform {
  /**
   * @param {number} [start]  Number of bytes to skip from the start before passing them on
   * @param {number} [end]    Number of bytes to omit form the end and signaling an end at this point
     */
  constructor(start, end) {
    super();
    this._start = start;
    this._end = end;
    this._step = 0;
  }

  /**
   *
   * @param {Buffer|*} chunk
   * @param {string} [encoding]
   * @private
   */
  _transform(chunk, encoding) {
    var buf = chunk instanceof Buffer ? chunk : new Buffer(chunk, encoding);
    if (this._end && this._step > this._end) {
      return;
    }
    this._step += buf.length;
    if (this._start && this._step < this._start) {
      return;
    }
    var offsetStart = 0, offsetEnd = buf.length;
    var relStart = this._step - this._start;
    if (this._start && relStart <= buf.length) {
      offsetStart = relStart;
    }
    var relEnd = this._end - this._step;
    if (this._end && relEnd < 0) {
      offsetEnd += relEnd;
    }
    this.push(buf.slice(offsetStart, offsetEnd));
  }
}

module.exports = OffsetStream;
