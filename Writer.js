'use strict';

var stream = require('stream');


class Writer extends stream.Readable {
  constructor(chunk, encoding = 'utf8') {
    super();
    this.on('end', () => this._closed = true);
    this._buffer = Buffer.alloc(0);
    this.write(chunk, encoding);
  }

  _read(size) {
    size = size || 64;
    if (this._buffer.length) {
      while(this._buffer.length) {
        var msg = this._buffer.slice(0, size);
        this._buffer = this._buffer.slice(size);
        if (!this.push(msg)) {
          break;
        }
      }
    } else {
      this.push(null);
    }
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
  }
}

module.exports = Writer;
