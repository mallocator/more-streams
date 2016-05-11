'use strict';

var stream = require('stream');


class Writer extends stream.Readable {
  constructor() {
    super();
    this._buffer = [];
  }

  _read(size) {
    if (this._buffer.length) {
      for (let msg of this.buffer) {
        this.push(msg);
      }
    }
    this._ready = true;
  }

  write(msg, encoding = 'utf8') {
    msg = msg instanceof Buffer ? msg : new Buffer(msg, encoding);
    if (this._ready) {
      this.push(msg);
    } else {
      this._buffer.push(msg);
    }
  }
}

module.exports = Writer;
