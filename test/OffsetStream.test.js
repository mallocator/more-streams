'use strict';

var expect = require('chai').expect;

var OffsetStream = require('../OffsetStream');
var Sink = require('../Sink');


describe('OffsetStream', () => {
  it('should let a stream pass through without changes', () => {
    var out = new Sink(true);
    var os = new OffsetStream();
    os.pipe(out);
    os.write(new Buffer('abcdef','hex'));
    expect(out.buffer[0].toString('hex')).to.equal('abcdef');
  });

  it('should offset a number of bytes from the start', () => {
    var out = new Sink(true);
    var os = new OffsetStream(2);
    os.pipe(out);
    os.write(new Buffer('abcdef','hex'));
    expect(out.buffer[0].toString('hex')).to.equal('cdef');
  });

  it('should offset a number of bytes from the end', () => {
    var out = new Sink(true);
    var os = new OffsetStream(null, 2);
    os.pipe(out);
    os.write(new Buffer('abcdef','hex'));
    expect(out.buffer[0].toString('hex')).to.equal('abcd');
  });

  it('should offset both from the start end and of a stream', () => {
    var out = new Sink(true);
    var os = new OffsetStream(2, 2);
    os.pipe(out);
    os.write(new Buffer('abcdef','hex'));
    expect(out.buffer[0].toString('hex')).to.equal('cd');
  });
});
