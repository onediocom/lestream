# lestream (Logentries stream for Node.JS)
lestream is a stream client for Logentries token based TCP endpoints for continuous log shipping. It has auto reconnect and buffering semantics. lestream does not provide object serialization or timestamping. It is intended for low level usage. I created it to use the cli interface and tail log files easily to logentries.

## install
### local
```
npm install lestream
```
### global (cli tool)
```
npm install -g lestream
```

## usage
### cli
Cli tool can read stdlib and stream logs to Logentries. It autoreconnects / buffers data and runs until the input stream is closed.

```
$ tail -f log.txt | lestream -t <TOKEN>

$ lestream -h

  Usage: lestream [options]

  Options:

    -h, --help           output usage information
    -t, --token [token]  logentries host token
    --host [hostname]    logentries hostname (default: data.logentries.com)
    --port <port>        logentries port (default: 10000)
    -b, --maxbuffer <len>  maximum buffered line count before starting to drop log entries (default: none)
```

### api

```
var lestream = require("lestream");

var logstream = lestream({
  token: "TOKEN",
  host: "data.logentries.com", //optional
  port: 10000 //optional
})

logstream.write("Log line");
```

## author
Ekin Koc <ekin@eknkc.com>

## license
MIT
