'use strict';

var expect = require('chai').expect;

var OffsetStream = require('../OffsetStream');
var Sink = require('../Sink');
var Writer = require('../Writer');


describe('OffsetStream', () => {
  it('should let a stream pass through without changes', () => {
    var out = new Sink({buffer: true});
    var os = new OffsetStream();
    os.pipe(out);
    os.write('abcdef');
    expect(out.message()).to.equal('abcdef');
  });

  it('should offset a number of bytes from the start', () => {
    var out = new Sink({buffer: true});
    var os = new OffsetStream().setStart(1);
    os.pipe(out);
    os.write(new Buffer('abcdef','hex'));
    expect(out.message('hex')).to.equal('cdef');
  });

  it('should offset a number of bytes from the end', () => {
    var out = new Sink({buffer: true});
    var os = new OffsetStream().setEnd(2);
    os.pipe(out);
    os.write(new Buffer('abcdef','hex'));
    expect(out.message('hex')).to.equal('abcd');
  });

  it('should offset both from the start end and of a stream', () => {
    var out = new Sink({buffer: true});
    var os = new OffsetStream({ start: 1, end: 2 });
    os.pipe(out);
    os.write(new Buffer('abcdef','hex'));
    expect(out.message('hex')).to.equal('cd');
  });

  it('should offset from start and end in a multi chunk scenario', done => {
    var out = new Sink({buffer: true});
    var inp = new Writer({ size: 4, forceSize: true })
      .write(new Buffer('00102030405060708090a0b0c0d0e0f0', 'hex'));
    var os = new OffsetStream({start: 5, length: 1});
    inp.pipe(os).pipe(out);
    out.on('finish', () => {
      expect(out.message('hex')).to.equal('50');
      done();
    });
  });
});
