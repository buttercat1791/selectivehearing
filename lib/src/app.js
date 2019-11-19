/**
 * @file app.js
 * 
 * @params [number of Tweets per search] [output file name] [hashtag keywords]
 * 
 * Entry and exit point for selectivehearing script.
 * Pulls 100,000 Tweets associated with specified hashtag and exports them to
 * a .csv file.
 */

import * as config from "lib/config/config.js";
import * as HashtagSearch from "hashtagsearch.js";
import * as JsonToCsv from "jsontocsv.js";

const numberOfTweets = Int(process.argv[2]);
const outputFileName = process.argv[3]
const hashtags = [];

var jsonTweets = [];
var search = new HashtagSearch(hashtags, numberOfTweets, config);
var jsonToCsv = new JsonToCsv();

// Put hashtags into an array
for (i = 4; i < process.argv.length; i++) {
    hashtags.push(process.argv[i]);
}

jsonTweets = await search.getResultsAsJson();
jsonToCsv.export(jsonTweets);