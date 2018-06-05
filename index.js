#!/usr/bin/env node
'use strict'

const program = require('commander');
const twitter = require('./tweet.js').getTwitter();

const green = '\u001b[32m';
const reset = '\u001b[0m';

const command = () => {
    program.version('0.0.1')
       .option('-t, --tweet <tweet>', '<tweet>をつぶやきます')
       .option('-l, --time-line [num]', '[num]個のツイートをタイムラインから表示', x => parseInt(x), 10)
       .option('-s, --streaming', 'streamingAPIでツイートを取得します')
       .parse(process.argv);

    if (program.tweet) {
        twitter.post('statuses/update', {status: program.tweet}, (err, tweet, res) => {
            if (!err) console.log('"' + tweet.text + '"' + 'と呟きました。');
            else console.log(err);
        });
    } else if (program.streaming) {
        twitter.get('statuses/home_timeline', {count: program.timeLine}, (err, tweets, res) => {
            tweets.reverse();
            tweets.forEach(x => printTweet(x));
        });
        twitter.stream('user', {}, stream => {
            stream.on('data', data => { 
                printTweet(data);
            });
        });
    } else if (program.timeLine) {
        twitter.get('statuses/home_timeline', {count: program.timeLine}, (err, tweets, res) => {
            tweets.reverse();
            tweets.forEach(x => printTweet(x));
        });
    } 
};


if (twitter.options.consumer_key) {
    command();
}

const printTweet = data => {
    console.log(green + data.user.name + " <@" + data.user.screen_name + '>' + reset);
    console.log(data.text + "\n");
};
