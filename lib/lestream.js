var util = require("util");
var net = require("net");
var split = require("split2");
var Writable = require('stream').Writable;

function Stream(options) {
  if (!(this instanceof Stream))
    return new Stream(data);

  this.token = options.token;
  this.host = options.host || "data.logentries.com";
  this.port = options.port || 10000;

  Writable.call(this, {
    objectMode: true,
    highWaterMark: options.maxbuffer || 16
  });

  var self = this;

  this.socket = net.createConnection(this.port, this.host);

  this.socket
  .on('error', reconnect)
  .on('end', reconnect)
  .on('close', reconnect)
  .on("connect", function () {
    self.connected = true;
  });

  this.on("finish", function finish() {
    self.timer && clearTimeout(self.timer);

    self.finished = true;
    self.socket.end();
  });

  this.on("unref", function () {
    self.unref = true;
  })

  function reconnect() {
    if (self.timer || self.finished || self.unref)
      return;

    self.connected = false;
    self.emit("reconnect");

    self.timer = setTimeout(function () {
      delete self.timer;
      self.socket.connect(self.port, self.host);
    }, 1000);
  }
}

util.inherits(Stream, Writable);

Stream.prototype._write = function(chunk, enc, next) {
  var self = this;

  this.socket.write(chunk, enc, function(err) {
    if (err) {
      setTimeout(function () {
        self._write(chunk, enc, next);
      }, 250).unref();

      return;
    }

    setImmediate(next);
  });
};

module.exports = function(options) {
  if (!options.token)
    throw new Error("Please provide a logentries token.");

  var stream = new Stream(options);

  var source = split(function (input) {
    return options.token + " " + input + "\n";
  });

  if (options.maxbuffer)
    lossypipe(source, stream);
  else
    source.pipe(stream);

  return source;
};

function lossypipe(from, to) {
  var overflow = false;

  from.on('data', function (data) {
    if (!overflow && !to.write(data, 'utf8'))
      overflow = true;
  });

  from.on('end', function () {
    to.end();
    to.emit('unref');
  });

  to.on('drain', function () {
    overflow = false;
  })
}
