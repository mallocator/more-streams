'use strict';

var stream = require('stream');

var chalk = require('chalk');


class ConsoleStream extends stream.Transform {
  /**
   * @typedef {Object} ColorRule
   * @property {string|RegExp} match    Regular expression that if matches will be styled
   * @property {string|string[]} styles Coloring styles
   */

  /**
   * @see {@link Transform}
   * @param {Object} options
   * @property {Writable} [output=process.stdout] Allows to set the output to a different receiver such as process.stderr
   * @property {ColorRule[]} [colors]             A list of coloring rules that will be applied to the output.
   */
  constructor(options) {
    super(options);
    var out = process.stdout;
    this._colors = [];
    if (options) {
      out = options.output || out;
      if (options.colors) {
        this._colors = options.colors instanceof Array ? options.colors : [ options.colors ];
        for (let color of this._colors) {
          color.styles = color.styles instanceof Array ? color.styles : [ color.styles];
        }
      }
    }
    this.pipe(out);
  }

  _colorize(styles, string) {
    for(let style of styles) {
      string = chalk[style](string);
    }
    return string;
  }

  _transform(chunk, encoding, cb) {
    var string = chunk.toString();
    for (let color of this._colors) {
        string = string.replace(color.match, this._colorize(color.styles, '$&'))
    }
    cb(null, string, 'utf8');
  }
}

module.exports = ConsoleStream;
