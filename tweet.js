'use strict'

const TwitterAPI = require('tweeter'),
      OAuth = require('oauth').OAuth,
      open = require('open');

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

module.exports.getTwitter = () => {
    if (!process.env.hasOwnProperty('access_token') ||
        !process.env.hasOwnProperty('access_secret')) {
        getAccessToken();
    }
    return new TwitterAPI({
        consumer_key: process.env.consumer_key,
        consumer_secret: process.env.consumer_secret,
        access_token_key: process.env.access_token,
        access_token_secret: process.env.access_secret
    });
};

const getAccessToken = () => {
    oauth.getOAuthRequestToken((error, oauthToken, oauthSecret, results) => {
        if (error) return;
        const authUrl = 'https://api.twitter.com/oauth/authorize?oauth_token=' + oauthToken;
        open(authUrl);
        rl.question("Input pin : ", ans => {
            oauth.getOAuthAccessToken(oauthToken, oauthSecret, ans, (err, token, secret) => {
               process.env.access_token = token;
               process.env.access_secret = secret;
            });
        });
    });
};
