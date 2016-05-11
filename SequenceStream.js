'use strict';

var stream = require('stream');


/**
 * A stream that will process multiple streams at a time and pass them all into on stream
 */
class SequenceStream extends stream.Duplex {
  constructor() {
    super();
    this._streams = [];
    this._buffer = [];
  }

  _read(size) {
    console.log('read');
    if (!this._streams.length && !this._currentStream) {
      return this.push();
    }
    this._switch();
    if (this._buffer.length) {
      this.push(this._buffer.shift());
    } else {
      this.push(this._currentStream.read());
    }
  }

  _switch() {
    if (!this._currentStream) {
      this._currentStream = this._streams.shift();
      this._currentStream.on('end', () => {
        this._currentStream = null;
      });
      console.log('switched')
      this._currentStream.pipe(this);
    }
  }

  _write(chunk, encoding) {
    console.log('write')
    chunk = chunk instanceof Buffer ? chunk : new Buffer(chunk, encoding);
    this.buffer.push(chunk);
  }

  /**
   *
   * @param {Writable|Writable[]} streams
   */
  chain(streams) {
    this._streams = this._streams.concat(streams);
    this._switch();
    return this;
  }
}

module.exports = SequenceStream;
