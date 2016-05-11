'use strict';

var stream = require('stream');

/**
 *
 */
class Sink extends stream.Writable {
  /**
   * @param {boolean|Buffer[]} [buffer]  Enable buffering or pass in an array reference where data will be stored.
   */
  constructor(buffer) {
    super();
    if (buffer) {
      this._buffer = buffer instanceof Array ? buffer : [];
    }
  }

  _write(chunk, encoding, cb) {
    this._buffer && this._buffer.push(chunk instanceof Buffer ? chunk : new Buffer(chunk, encoding));
    cb();
  }

  /**
   * Returns a reference to the buffer used by the sink (if one has been set).
   * @returns {Buffer[]}
   */
  get buffer() {
    return this._buffer;
  }

  /**
   * Returns the buffered string as one message.
   * @param {string} [encoding='utf8']  The encoding used to generate the string from the buffer.
   * @returns {string}
   */
  message(encoding = 'utf8') {
    return Buffer.concat(this._buffer).toString(encoding)
  }

  /**
   * Clears the buffer (if there is any).
   */
  clear() {
    this._buffer && (this._buffer.length = 0);
  }
}

module.exports = Sink;
