'use strict';

var chalk = require('chalk');
var expect = require('chai').expect;

var ConsoleStream = require('../ConsoleStream');
var Sink = require('../Sink');


describe('ConsoleStream', () => {
  chalk.enabled = true;

  it('should stream all data unchanged to console', done => {
    var sink = new Sink({ buffer: true });
    var out = new ConsoleStream({ output: sink });
    sink.on('finish', () => {
      expect(sink.message()).to.equal('message');
      done();
    });
    out.write('message');
    out.end();
  });

  it('should print all e letters in red', done => {
    var sink = new Sink({buffer: true});
    var out = new ConsoleStream({
      output: sink,
      colors: {
        match: /e/g,
        styles: 'red'
      }
    });
    sink.on('finish', () => {
      expect(sink.message()).to.equal('m[31me[39mssag[31me[39m');
      done();
    });
    out.write('message');
    out.end();
  });

  it('should apply multiple styles with multiple matches', done => {
    var sink = new Sink({buffer: true});
    var out = new ConsoleStream({
      output: sink,
      colors: [{
        match: 'e',
        styles: ['red', 'underline']
      }, {
        match: /s/g,
        styles: 'blue'
      }]
    });
    sink.on('finish', () => {
      expect(sink.message()).to.equal('m[4m[31me[39m[24m[34ms[39m[34ms[39mage');
      done();
    });
    out.write('message');
    out.end();
  });
});
