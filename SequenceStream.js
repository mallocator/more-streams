'use strict';

var stream = require('stream');


/**
 * A stream that will process multiple streams at a time and pass them all into on stream.
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
    this._enabled = true;
  }

  _transform(chunk, encoding, cb) {
    var buf = chunk instanceof Buffer ? chunk : new Buffer(chunk, encoding);
    cb(null, buf);
  }

  /**
   * Changes the current read stream to the next one if the last one is done and has been cleared, or no source has yet
   * been chosen.
   * @private
   */
  _next() {
    if (!this._current) {
      if (!this._streams.length) {
        this._enabled = false;
        return this.end();
      }
      this._current = new stream.Readable().wrap(this._streams.shift());
      this._current.on('end', () => {
        this._current = null;
        this._next();
      });
      this._current.pipe(this, { end: false });
    }
  }

  /**
   * Add stream(s) that will be used as a source and read in the given order. Multiple calls to this method will queue
   * up additional streams at the end. Once all streams have been processed this instance will not allow to add any more
   * chained streams. Instead you have to create a new object.
   * @param {Readable|Readable[]} streams
   */
  chain(streams) {
    if (!this._enabled) {
      return this.emit('error', 'Stream is closed, unable to add more sources');
    }
    if (streams) {
      for (let stream of arguments) {
        this._streams = this._streams.concat(stream);
      }
    }
    return this;
  }

  /**
   * Overrides the pipe function so that we don't wire up any chains before there's a pipe to send data to.
   * @returns {Stream}
   */
  pipe() {
    var stream = super.pipe.apply(this, arguments);
    this._next();
    return stream;
  }
}

module.exports = SequenceStream;
