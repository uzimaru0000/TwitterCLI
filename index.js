#!/usr/bin/env node
'use strict'

const program = require('commander');
const twitter = require('./tweet.js').getTwitter();

const command = () => {
    program.version('0.0.1')
       .option('-t, --tweet <tweet>', '<tweet>をつぶやきます')
       .option('-l, --time-line [num]', '[num]個のツイートをタイムラインから表示', x => parseInt(x), 10)
       .parse(process.argv);

    if (program.tweet) {
        twitter.post('statuses/update', {status: program.tweet}, (err, tweet, res) => {
            if (!err) console.log('"' + tweet.text + '"' + 'と呟きました。');
            else console.log(err);
        });
    } else if (program.timeLine) {
        twitter.get('statuses/home_timeline', {count: program.timeLine}, (err, tweets, res) => {
            tweets.reverse();
            tweets.forEach(x => {
                console.log("─" + x.user.name + " <@" + x.user.screen_name + '> ──────────');
                console.log(x.text + "\n");
            });
        });
    }
};

command();
