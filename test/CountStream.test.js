'use strict';

var expect = require('chai').expect;

var CountStream = require('../CountStream');
var Sink = require('../Sink');
var Writer = require('../Writer');

describe('CountStream', () => {
  it('should process a single stream normally', done => {
    var cs = new CountStream();
    var inp = new Writer().write('102030', 'hex');
    var out = new Sink({buffer: true});
    cs.on('end', () => {
      expect(out.buffer.length).to.equal(1);
      expect(out.message('hex')).to.equal('102030');
      expect(cs.count).to.equal(3);
      done();
    });
    inp.pipe(cs).pipe(out);
  });
});
