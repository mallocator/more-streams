'use strict';

var stream = require('stream');


/**
 * A stream that will multiplex data from a single stream to multiple streams.
 */
class MultiplexStream extends stream.Writable {
  /**
   * @see {@link Writable}
   * @param {Object} [options]
   */
  constructor(options) {
    super(options);
    this._streams = [];
  }

  /**
   * @param {Buffer|*} chunk
   * @param {string} [encoding]
   * @param {function} cb
   * @private
   */
  _write(chunk, encoding, cb) {
    for (let stream of this._streams) {
      if (chunk instanceof Buffer) {
        let copy = Buffer.alloc(chunk.length)
        chunk.copy(copy);
        stream.write(copy, encoding);
      } else {
        stream.write(chunk.slice(0), encoding);
      }
    }
    setImmediate(cb);
  }

  /**
   * @param {Writable[]} streams  One or more writable streams (each argument should be a new stream).
   */
  pipe(streams, options) {
    for (let stream of arguments) {
      this._streams = this._streams.concat((stream));
    }
    return this;
  }
}

module.exports = MultiplexStream;
