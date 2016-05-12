'use strict';

var stream = require('stream');


/**
 * A stream that will process multiple streams at a time and pass them all into on stream
 */
class SequenceStream extends stream.Transform {
  /**
   * @see {@link Readable}
   * @param {object} [options]
   */
  constructor(options) {
    super(options);
    this._streams = [];
    this._buffer = [];
  }

  _transform(chunk, encoding, cb) {
    cb(null, chunk);
  }

  _next() {
    if (!this._current) {
      if (!this._streams.length) {
        return this.push(null);
      }
      this._current = this._streams.shift();
      this._current.on('end', () => {
        this._current = null;
        this._next();
      });
      this._current.pipe(this, {end: false});
    }
  }

  /**
   * @param {Readable|Readable[]} streams
   */
  chain(streams) {
    if (streams) {
      for (let stream of arguments) {
        this._streams = this._streams.concat(stream);
      }
    }
    this._next();
    return this;
  }
}

module.exports = SequenceStream;
