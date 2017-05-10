#!/usr/bin/env node
'use strict'

let program = require('commander');

program.version('0.0.1')
       .usage('[options] <keyword>')
       .option('-t, --tweet <value>', 'Add peppers', parseInt)
       .parse(process.argv);

if (!program.args.length) program.help(); 
if (program.tweet) console.log(program.tweet);
