# more-streams
[![npm version](https://badge.fury.io/js/more-streams.svg)](http://badge.fury.io/js/more-streams)
[![Build Status](https://travis-ci.org/mallocator/more-streams.svg?branch=master)](https://travis-ci.org/mallocator/more-streams)
[![Coverage Status](https://coveralls.io/repos/github/mallocator/more-streams/badge.svg?branch=master)](https://coveralls.io/github/mallocator/more-streams?branch=master)
[![Dependency Status](https://david-dm.org/mallocator/more-streams.svg)](https://david-dm.org/mallocator/more-streams) 

A collection of useful stream implementations.

This is a library that makes a number of general purpose stream implementation available for your
everyday use. This collection will grow over time, so don't hesitate to make feature requests for 
a stream implementation that you think should be in this library.

## Installation

```npm install --save more-streams```


## Requirements

This library has been written to work with Node.js _v6.x_ and the latest ES2015 features.


## API

There are 2 ways to include streams:

```
var CountStream = require('more-streams').CountStream;
```
or
```
var CountStream = require('more-streams/CountStream');
```


All streams extend a standard stream implementation and pass on any constructor options that are 
standard for this type of stream. Some of the helpers extend that options object for their
specific use.

For more details take a look at the jsdoc and the tests.


### ConsoleStream

This is a simple alias for _process.stdout_ for now.
```
var ConsoleStream = require('more-streams/ConsoleStream');
var out = new ConsoleStream();
otherStream.pipe(out);

// -> prints to console
```


### CountStream

This is a stream that will count the number of bytes that have passed through. 
```
var CountStream = require('more-streams/CountStream');
var counter = new CountStream();
counter.on('end', () => console.log(counter.count)); // -> prints total stream bytes count
otherStream.pipe(counter).pipe(process.stdout);
```

The stream also allows you to set markers which will trigger an event that you can react to.
```
var CountStream = require('more-streams/CountStream');
var counter = new CountStream();
counter.addMarker(10);
counter.on('marker', (count, counter) => console.log(count, counter.count)); // -> prints 10, 10
otherStream.pipe(counter).pipe(process.stdout);
```


### MultiplexStream

A stream that will copy data and pipe it to multiple streams.
```
var MultiplexStream = require('more-streams/MultiplexStream');
var mux = new MultiplexStream();
otherStream.pipe(mux).pipe([process.stdout, process.stdout]);

// -> prints same output to 2 consoles
```


### OffsetStream

A stream that allows to omit data from the beginning and end of another stream.
```
var OffsetStream = require('more-streams/OffsetStream');
var offset = new OffsetStream({start: 10, end: 20});
otherStream.pipe(offset).pipe(process.stdout);

// -> prints from 10th byte to 20th byte of the total stream
```


### SequenceStream

A stream that allows to sequentially read data from multiple streams into one.
```
var SequenceStream = require('more-streams/SequenceStream');
var demux = new SequenceStream();
demux.chain(otherStream1, otherStream2, otherStream3);
demux.pipe(process.stdout);

// -> prints in order from stream 1,2 and then 3 to console.
```


### Sink

A stream that will consume all data given. Optionally this stream can buffer all incoming data
for later use.
```
var Sink = require('more-streams/Sink');
var buffer = new Sink({ buffer: true });
buffer.on('end', () => console.log(buffer.message('hex')));  // -> prints to console
otherStream.pipe(buffer);
```


### Writer

A stream that can be preloaded with data ready to be read when a stream triggers a read.
```
var Writer = require('more-streams/Writer');
var output = new Writer();
output.write('message');
output.pipe(process.stdout);

// -> prints to console 'message'
```


## Tests

To run tests and generate a coverage report run:

``` npm test```
