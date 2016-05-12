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

  it('should emit an event on a marker', done => {
    var cs = new CountStream().addMarker(2);
    var inp = new Writer().write('102030', 'hex');
    var out = new Sink();
    cs.on('marker', pos => {
      expect(pos).to.equal(2);
      done();
    });
    inp.pipe(cs).pipe(out);
  });

  it('should emit an event on multiple markers if they are all fired in one go', done => {
    var cs = new CountStream().addMarker(2, 3);
    var inp = new Writer().write('102030405060708090', 'hex');
    var out = new Sink();
    var events = 0;
    cs.on('marker', pos => {
      switch(events) {
        case 0:
          expect(pos).to.equal(2);
          break;
        case 1:
          expect(pos).to.equal(3);
          done();
      }
      events++;
    });
    inp.pipe(cs).pipe(out);
  });

  it('should emit multiple events even if they are in separate chunks', done => {
    var cs = new CountStream().addMarker(2, 8);
    var inp = new Writer({ size: 2, forceSize: true }).write('102030405060708090', 'hex');
    var out = new Sink();
    var events = 0;
    cs.on('marker', pos => {
      switch(events) {
        case 0:
          expect(pos).to.equal(2);
          break;
        case 1:
          expect(pos).to.equal(8);
          done();
      }
      events++;
    });
    inp.pipe(cs).pipe(out);
  });

  it('should remove a previously set marker', done => {
    var cs = new CountStream().addMarker(2, 5, 8, 9);
    var inp = new Writer({ size: 2, forceSize: true }).write('102030405060708090', 'hex');
    var out = new Sink();
    var events = 0;
    cs.on('marker', pos => {
      switch(events) {
        case 0:
          expect(pos).to.equal(2);
          break;
        case 1:
          expect(pos).to.equal(9);
          done();
      }
      events++;
    });
    cs.removeMarker([], 5, [6, 8]);
    inp.pipe(cs).pipe(out);
  });
});
