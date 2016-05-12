'use strict';

var stream = require('stream');


/**
 * A stream that will offset data by a given number of bytes off the start and end. This stream will convert any incoming
 * chunk to {@link Buffer}s and pass them on like that, if they aren't already buffers to begin with.
 */
class OffsetStream extends stream.Transform {
  /**
   * @see {@link Transform}
   * @param {object} [options]
   * @property {number} [options.start]   Position in bytes to skip from the start before passing them on
   * @property {number} [options.end]     Position in bytes to omit form the end and signaling an end at this point
   * @property {number} [options.length]  Number of bytes to pass on (an alternative to end)
   */
  constructor(options) {
    super();
    this._start = 0;
    this._end = Number.MAX_VALUE;
    this._length = this._end - this._start;
    if (options) {
      this.setStart(options.start);
      this.setEnd(options.end);
      this.setLength(options.length);
    }
    this._step = 0;
    this.on('end', () => this._closed = true);
    this.on('finished', () => this._closed = true);
    this.on('closed', () => this._closed = true);
  }

  /**
   * Set a start position from where to pass on data. This setting will override the length property
   * based on where the end is set.
   * @param position
   * @returns {OffsetStream}
     */
  setStart(position) {
    if (this._closed) {
      throw new Error('Stream has already been closed');
    }
    if (position !== null || position !== undefined) {
      if (position > this._end) {
        throw new Error('Invalid: start position is bigger than end position.');
      }
      this._start = position;
      this._length = this._end - this._start + 1;
    }
    return this;
  }

  /**
   * Set a length for how many bytes to pass on before ending. This setting will override the end property
   * based on where start is set.
   * @param length
   * @returns {OffsetStream}
     */
  setLength(length) {
    if (this._closed) {
      throw new Error('Stream has already been closed');
    }
    if (length !== null && length !== undefined) {
      this._length = length;
      this._end = this._start + this._length;
    }
    return this;
  }

  /**
   * Set an end position up to where data is processed. This setting will override the length property
   * based on where the start is set.
   * @param position
   * @returns {OffsetStream}
     */
  setEnd(position) {
    if (this._closed) {
      throw new Error('Stream has already been closed');
    }
    if (position !== null || position !== undefined) {
      if (position < this._start) {
        throw new Error('Invalid: end position is smaller than start position.');
      }
      this._end = position;
      this._length = this._end - this._start + 1;
    }
    return this;
  }

  /**
   *
   * @param {Buffer|*} chunk
   * @param {string} [encoding]
   * @param {function} cb
   * @private
   */
  _transform(chunk, encoding, cb) {
    var buf = chunk instanceof Buffer ? chunk : new Buffer(chunk, encoding);
    var length = buf.length;
    var left = this._step;
    var right = left + length;
    this._step += length;
    if (this._start >= right) {
      return setImmediate(cb);
    }
    if (this._end <= left) {
      return setImmediate(cb);
    }
    var posStart = 0, posEnd = length;
    if(left < this._start && this._start < right) {
      posStart = this._start - left;
    }
    if(left <= this._end && this._end < right) {
      posEnd = this._end - left;
    }
    this.push(buf.slice(posStart, posEnd));
    setImmediate(cb);
  }
}

module.exports = OffsetStream;
