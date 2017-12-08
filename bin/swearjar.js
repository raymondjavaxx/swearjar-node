#!/usr/bin/env node

var fs = require('fs');
var swearjar = require('../lib/swearjar');
var chalk = require('chalk');
var log = console.log;

var args = process.argv.slice(2);
var files = args.filter(function (arg) {
  return arg.substr(0, 2) !== '--';
});

if (args[0] === '--version'){
  var version = require('../package.json').version;
  var name = require('../package.json').name;
  console.log(name+' version ' + version);
  process.exit(0);
}

if (files.length === 0) {
  console.log('You did not provide any files to check');
  process.exit(1);
}

files.forEach(function (file) {
    var contents = fs.readFileSync(file, 'utf8');
    var scorecard = swearjar.scorecard(contents);

    if(Object.keys(scorecard).length > 0){
      log(chalk.bold.red(file));
      console.log(scorecard);
    } else {
      log(chalk.bold.green(file));
    }
});
