'use strict';

var stream = require('stream');


/**
 * A stream that counts the number of bytes passed through. The stream allows to set markers at which a "marker" event
 * is fired.
 */
class CountStream extends stream.Transform {
  /**
   * @see {@link Transform}
   * @param {object} [options]
   * @property {number|number[]} markers  Add one or more markers that will fire a "marker" event once the number of
   *                                      bytes have been processed.
   */
  constructor(options) {
    super(options);
    this.clear();
    if (options) {
      this.addMarker(options.markers)
    }
    this._bytes = 0;
  }

  /**
   * Add one or more markers that you would like to have an event be fired on.
   * @param {...number|number[]} marker
   * @return {CountStream}
   */
  addMarker(marker) {
    if (marker) {
      for (let entry of arguments) {
        this._markers = this._markers.concat(entry);
      }
      this._markers.sort();
    }
    return this;
  }

  /**
   * Remove one or more markers that have been set previously.
   * @param {...number|number[]} marker
   * @return {CountStream}
   */
  removeMarker(marker) {
    if (marker) {
      this._markers = this._markers.filter(val => {
        for (let entry of arguments) {
          if (entry instanceof Array) {
            if (entry.indexOf(val) !== -1) {
              return false;
            }
          } else if (entry == val) {
            return false;
          }
        }
        return true;
      });
    }
    return this;
  }

  /**
   * Removes all registered markers.
   */
  clear() {
    this._markers = [];
    return this;
  }

  _transform(chunk, encoding, cb) {
    var buf = chunk instanceof Buffer ? chunk : new Buffer(chunk, encoding);
    this._bytes += buf.length;
    while (this._markers.length && this._markers[0] <= this._bytes) {
      this.emit('marker', this._markers.shift());
    }
    if (this.push(buf)) {
      setImmediate(cb);
    }
  }

  /**
   * Returns the number of bytes that have been read so far.
   * @returns {number}
     */
  get count() {
    return this._bytes;
  }
}

module.exports = CountStream;
