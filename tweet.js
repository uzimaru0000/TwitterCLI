'use strict'

const TwitterAPI = require('twitter'),
      OAuth = require('oauth').OAuth,
      open = require('open'),
      fs = require('fs');

require('dotenv').config();

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const oauth = new OAuth(
    "https://api.twitter.com/oauth/request_token",
    "https://api.twitter.com/oauth/access_token",
    process.env.CONSUMER_KEY,
    process.env.CONSUMER_SECRET,
    "1.0",
    null,
    "HMAC-SHA1"
);

module.exports.getTwitter = () => {
    if (!process.env.ACCESS_TOKEN || !process.env.ACCESS_SECRET) {
        getAccessToken();
    }
    rl.close();
    return new TwitterAPI({
        consumer_key: process.env.CONSUMER_KEY,
        consumer_secret: process.env.CONSUMER_SECRET,
        access_token_key: process.env.ACCESS_TOKEN,
        access_token_secret: process.env.ACCESS_SECRET
    });
};

const getAccessToken = () => {
    oauth.getOAuthRequestToken((error, oauthToken, oauthSecret, results) => {
        if (error) {
            console.log(error);
            return;
        }
        const authUrl = 'https://api.twitter.com/oauth/authorize?oauth_token=' + oauthToken;
        open(authUrl);
        rl.question("Input pin : ", ans => {
            oauth.getOAuthAccessToken(oauthToken, oauthSecret, ans, (err, token, secret) => {
                if (err) {
                    console.log(err);
                    return;
                } else {
                   process.env.ACCESS_TOKEN = token;
                   process.env.ACCESS_SECRET = secret;
                   fs.appendFileSync('.env', "ACCESS_TOKEN=" + token + '\n', 'utf8');
                   fs.appendFileSync('.env', "ACCESS_SECRET=" + secret + '\n', 'utf8');
                }
            });
        });
    });
};
