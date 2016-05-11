'use strict';

var stream = require('stream');


/**
 * A stream that will multiplex data from a single stream to multiple streams.
 */
class MultiplexStream extends stream.Writable {
  constructor() {}

  /**
   *
   * @param {Buffer|*} chunk
   * @param {string} [encoding]
   * @private
   */
  _write(chunk, encoding) {
    for (let stream of this._streams) {
      stream.write(chunk, encoding);
    }
  }

  /**
   * @param {Writable[]} streams  One or more writable streams (each argument should be a new stream).
   */
  pipe(...streams) {
    this._streams = streams;
  }
}

module.exports = MultiplexStream;
