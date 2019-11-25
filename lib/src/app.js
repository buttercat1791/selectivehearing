/**
 * @file app.js
 * 
 * @params [number of Tweets per search] [output file name] [hashtag keywords]
 * 
 * Entry and exit point for selectivehearing script.
 * Pulls 100,000 Tweets associated with specified hashtag and exports them to
 * a .csv file.
 */

var config = require('../config/config.js');
var HashtagSearch = require('./hashtagsearch.js');
var JsonToCsv = require('./jsontocsv.js');

const numberOfTweets = Number(process.argv[2]);
const outputFileName = process.argv[3]
const hashtags = [];

// Put hashtags into an array
for (i = 4; i <= process.argv.length; i++) {
    hashtags.push(process.argv[i]);
}

var jsonTweets = [];
var search = new HashtagSearch(hashtags, numberOfTweets, config);
var jsonToCsv = new JsonToCsv();

search.getResultsAsJson(function(data) {
    jsonTweets = data;
    // jsonToCsv.export(jsonTweets);
});