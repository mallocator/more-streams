'use strict';

var stream = require('stream');

var expect = require('chai').expect;

var SequenceStream = require('../SequenceStream');
var Sink = require('../Sink');
var Writer = require('../Writer');

describe('SequenceStream', () => {
  it('should process a single stream normally', done => {
    var ss = new SequenceStream();
    var writer = new Writer();
    var out = new Sink(true);
    ss.on('end', () => {
      expect(out.buffer.length).to.equal(1);
      expect(out.message()).to.equal('msg');
      done();
    });
    writer.write('msg');
    ss.chain(writer);
    ss.pipe(out);
  });

  it('should process multiple streams in the right order', done => {
    var streamNr = 3;
    var message = '';
    var ss = new SequenceStream();
    var out = new Sink(true);
    for (let i = 1; i <= streamNr; i++) {
      message += 'msg' + i;
      ss.chain(new Writer('msg' + i));
    }
    ss.on('end', () => {
      expect(out.buffer.length).to.equal(streamNr);
      expect(out.message()).to.equal(message);
      done();
    });
    ss.pipe(out);
  });
});
