#!/usr/bin/env node

var program = require('commander');
var lestream = require("../lib/lestream.js");

program
.option('-t, --token [token]', 'logentries host token')
.option('--host [hostname]', 'logentries hostname (default: data.logentries.com)')
.option('--port <port>', 'logentries port (default: 10000)')
.option('-b, --maxbuffer <len>', 'maximum buffered line count before starting to drop log entries (default: none)')
.parse(process.argv);

if (!program.token) {
  console.error("Required option: token");
  process.exit(-1);
}

process.stdin.setEncoding('utf8');

process.stdin.pipe(lestream({
  token: program.token,
  host: program.host,
  port: program.port,
  timeout: program.timeout,
  maxbuffer: program.maxbuffer
}));
