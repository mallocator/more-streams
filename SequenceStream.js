'use strict';

var stream = require('stream');


/**
 * A stream that will process multiple streams at a time and pass them all into on stream
 */
class SequenceStream extends stream.Readable {
  /**
   * @see {@link Readable}
   * @param {object} [options]
   */
  constructor(options) {
    super(options);
    this._streams = [];
    this._buffer = [];
  }

  _read(size) {
    if (!this._current) {
      if (!this._streams.length) {
        return this.push(null);
      }
      this._current = this._streams.shift();
      this._current.on('end', () => {
        this._current = null;
        this._read(size);
      });
      this._current.on('readable', () => {
        let chunk;
        while (null !== (chunk = this._current.read(size))) {
          if (!this.push(chunk)) {
            this._current.pause();
            break;
          }
        }
      });
    }
    if (this._current.isPaused()) {
      this._current.resume();
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
    return this;
  }
}

module.exports = SequenceStream;
