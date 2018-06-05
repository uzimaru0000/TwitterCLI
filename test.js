'use strict'

const twitter = require('./tweet.js').getTwiiter();

const data = twitter.get('users/show', {screen_name: uzimaru0000}, (err, tweet, respons) => {
    console.log(tweet);
});
