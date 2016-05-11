'use strict';

var expect = require('chai').expect;

var Sink = require('../Sink');
var Writer = require('../Writer');


describe('Writer', () => {
  it('should write a message to another stream', done => {
    var out = new Sink(true);
    var inp = new Writer('Hello');
    inp.on('end', () => {
      expect(out.buffer.length).to.equal(1);
      expect(out.message()).to.equal('Hello');
      done();
    });
    inp.pipe(out);
  });

  it('should throw an error if the stream has already been closed.', done => {
    var out = new Sink(true);
    var inp = new Writer('Hello');
    inp.on('end', () => {
      expect(out.buffer.length).to.equal(1);
      expect(out.message()).to.equal('Hello');
      inp.write('Too Late');
    });
    inp.on('error', err => {
      expect(err).to.be.instanceOf(Error);
      done();
    });
    inp.pipe(out);
  });
});


