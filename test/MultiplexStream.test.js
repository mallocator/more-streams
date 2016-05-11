'use strict';

var expect = require('chai').expect;

var MultiplexStream = require('../MultiplexStream');
var Sink = require('../Sink');
var Writer = require('../Writer');


describe('MultiplexStream', () => {
  it('should process a single stream normally', done => {
    var ms = new MultiplexStream();
    var writer = new Writer();
    var out = new Sink({ buffer:true });
    writer.on('end', () => {
      expect(out.buffer.length).to.equal(1);
      expect(out.message()).to.equal('msg');
      done();
    });
    writer.write('msg');
    writer.pipe(ms).pipe(out);
  });

  it('should process multiple streams in the right order', done => {
    var streamNr = 3;
    var ms = new MultiplexStream();
    var writer = new Writer().write('msg');
    var outs = [];
    for (let i = 1; i <= streamNr; i++) {
      outs.push(new Sink({ buffer:true }));
    }
    writer.on('end', () => {
      for (let out of outs) {
        expect(out.message()).to.equal('msg');
      }
      done();
    });
    writer.pipe(ms).pipe(outs);
  });
});
