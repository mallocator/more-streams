'use strict';

var stream = require('stream');


/**
 * A simple Writer stream for when you can't write to a stream directly and need to rely on the read event of a sink.
 */
class Writer extends stream.Readable {
  /**
   * @see {@link Readable}
   * @param {object} [options]
   * @property {number} [options.size=16384]  The number of bytes to transfer with each push operation. Will only be used
   *                                          if the reading stream doesn't supply size.
   * @property {boolean} [options.forceSize]  Forces the writer to use the given size option and ignore reading streams.
   */
  constructor(options) {
    super(options);
    if (options) {
      this._size = options.size || 16384;
      this._forceSize = !!options.forceSize;
    }
    this.on('end', () => this._closed = true);
    this._buffer = Buffer.alloc(0);
  }

  _read(size) {
    size = this._forceSize ? this._size : size || this._size;
    while(this._buffer.length) {
      var length = Math.min(size, this._buffer.length);
      var chunk = this._buffer.slice(0, length);
      this._buffer = this._buffer.slice(length);
      if (!this.push(chunk)) {
        break;
      }
    }
    this.push(null);
  }

  /**
   * Allows to write to this stream until the end event has been emitted.
   * @param {Buffer|string} chunk       The message to be sent to the stream. Buffer, or string in combination with encoding.
   * @param {string} [encoding='utf8] Sets the encoding if the msg is a string, ignored otherwise.
   */
  write(chunk, encoding = 'utf8') {
    if (this._closed)        {
      this.emit('error', new Error('Tried to write to closed stream'));
    }
    if (chunk) {
      chunk = chunk instanceof Buffer ? chunk : new Buffer(chunk, encoding);
      this._buffer = Buffer.concat([this._buffer, chunk], this._buffer.length + chunk.length);
    }
    return this;
  }
}

module.exports = Writer;
