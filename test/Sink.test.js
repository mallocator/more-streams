'use strict';

var expect = require('chai').expect;

var Sink = require('../Sink');


describe('Sink', () => {
  it('should clear all stored data', () => {
    var out = new Sink({ buffer: true });
    expect(out.message()).to.equal('');
    out.write('msg');
    expect(out.message()).to.equal('msg');
    out.clear();
    expect(out.message()).to.equal('');
  });

  it('should not store any data without a buffer', () => {
    var out = new Sink();
    expect(out.message()).to.equal('');
    out.write(new Buffer('msg', 'utf8'));
    expect(out.message()).to.equal('');
  });
});
