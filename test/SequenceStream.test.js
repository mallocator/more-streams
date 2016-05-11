'use strict';

var stream = require('stream');

var expect = require('chai').expect;

var SequenceStream = require('../SequenceStream');
var Sink = require('../Sink');
var Writer = require('../Writer');

describe('SequenceStream', () => {
  it('should process a single stream normally', () => {
    var ss = new SequenceStream();
    var writer = new Writer();
    var out = new Sink(true);
    writer.write('msg 1');
    writer.pipe(ss).pipe(out);
    expect(out.buffer.length).to.equal(1);
    expect(out.message()).to.equal('msg 2');
  });

  it('should process multiple streams in the right order', () => {
    var ss = new SequenceStream();
    var writer1 = new Writer();
    var writer2 = new Writer();
    var out = new Sink(true);
    ss.chain(writer1).chain(writer2).pipe(out);
    writer2.write('msg 1');
    writer1.write('msg 2');
    expect(out.buffer.length).to.equal(2);
    expect(out.message()).to.equal('msg 2msg 1');
  });
});
