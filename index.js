#!/usr/bin/env node
'use strict'

const program = require('commander');
const TwitterAPI = require('twitter');
const OAuth = require('oauth').OAuth;
const open = require('open');
const env = require('./.config.json');
const fs = require('fs');

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const oauth = new OAuth(
    "https://api.twitter.com/oauth/request_token",
    "https://api.twitter.com/oauth/access_token",
    env.consumer_key,
    env.consumer_secret,
    "1.0",
    null,
    "HMAC-SHA1"
);

const command = () => {
    program.version('0.0.1')
       .option('-t, --tweet <tweet>', '<tweet>をつぶやきます')
       .option('-l, --time-line [num]', '[num]個のツイートをタイムラインから表示', x => parseInt(x), 10)
       .parse(process.argv);

    const twitter = new TwitterAPI({
        consumer_key: env.consumer_key,
        consumer_secret: env.consumer_secret,
        access_token_key: env.access_token,
        access_token_secret: env.access_secret
    });

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

if (!env.hasOwnProperty('access_token') || !env.hasOwnProperty('access_secret')) {
    oauth.getOAuthRequestToken((error, oauthToken, oauthTokenSecret, results) => {
        if (error) return;
        const authUrl = 'https://api.twitter.com/oauth/authorize?oauth_token=' + oauthToken;
        open(authUrl);
        rl.question("Input pin : ", ans => {
            const oauthVerifier = ans;
            oauth.getOAuthAccessToken(oauthToken, oauthTokenSecret, oauthVerifier, (err, accessToken, accessSecret) => {
                env.access_token = accessToken;
                env.access_secret = accessSecret;
                fs.writeFileSync('.config.json', JSON.stringify(env));
                command();
            });
            rl.close();
        });
    });
} else {
    command();
    rl.close();
}