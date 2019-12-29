/**
 * @file app.js
 * 
 * @params [number of Tweets per search] [keywords]
 * 
 * Entry and exit point for selectivehearing script.
 * Pulls 100,000 Tweets associated with specified hashtag and exports them to
 * a .csv file.
 */

var config = require('../config/config.js');
var HashtagSearch = require('./hashtagsearch.js');

const numberOfTweets = Number(process.argv[2]);
const hashtags = [];

// Put hashtags into an array
for (i = 3; i < process.argv.length; i++) {
    hashtags.push(process.argv[i]);
}

var search = new HashtagSearch(hashtags, numberOfTweets, config);

search.getResultsAsJson();