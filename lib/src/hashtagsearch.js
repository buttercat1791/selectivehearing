/**
 * @file hashtagsearch.js
 * 
 * Contains class that searches Twitter for given hashtags, and returns a
 * specified number of Tweets from each hashtag.
 * 
 * Uses technique found in:
 * https://bhaskarvk.github.io/2015/01/how-to-use-twitters-search-rest-api-most-effectively./
 * 
 * Documentation for the Twitter client library used here can be found at:
 * https://github.com/desmondmorris/node-twitter
 */

var Twitter = require('twitter');

class HashtagSearch {

    constructor(hashtags, resultCount, config) {
        this.hashtags = hashtags;
        this.resultCount = resultCount;
        this.config = config;
        this.twitterClient = new Twitter(config);

        this.searchApiEndpoint = 'search/tweets' // Query is appended later.
        this.countPerPage = 100     // Number of tweets per page (maximum 100).
        this.exportData = [];
        this.results = [];
    }

    // Makes a series of calls to the Twitter Search API to get the JSON
    // representation of the number of Tweets given by this.resultCount.
    // Each API call returns a maximum of 100 Tweets, so this function uses
    // pagination and some additional parameters to get older Tweets.
    async getJsonArray(hashtag, callback) {
        var max_id;
        this.twitterClient.get('search/tweets', {q: 'SXSW'},
                (error, tweets, response) => {
            if (error) {
                console.log(error);
            }
            callback(tweets.statuses);
        });
    }

    // Takes an array of JSON objects (representing Tweets), and returns a new
    // array of JSON objects where each object corresponds to a Tweet, and
    // contains the Twitter handle of the source, the number of followers of
    // that handle, the number of accounts that handle is following, and
    // whether the Tweet in question is a retweet.
    parseJsonArray(tweets, callback) {
        var tweetData = new Array(tweets.length);

        tweets.forEach((tweet, index) => {
            var dataObject = {
                "handle":tweet.user.screen_name,
                "followers":tweet.user.followers_count,
                "following":tweet.user.friends_count,
                "retweet":tweet.retweeted
            };  // TODO: Add following count
            tweetData[index] = dataObject;
        });

        callback(tweetData);
    }

    // This async method returns an array of arrays of JSON objects containing
    // the data to be exported for each tweet.
    // The exportData array has n items where n is the number of search terms 
    // in the hashtags array.
    // Each item in exportData is an array containing the JSON representation
    // of the required data from each of the Tweets returned by the search
    // performed in getJsonArray and filtered through parseJsonArray.
    async getResultsAsJson(callback) {
        var exportData = [];
        var self = this;

        for (var i = 0; i < this.hashtags.length; i++) {
            this.getJsonArray(this.hashtags[i], (result) => {
                this.parseJsonArray(result, (parsedArray) => {
                    exportData[i] = parsedArray;
                    console.log(parsedArray[0]);
                });
            });
        }

        callback(exportData);
    }

}

module.exports = HashtagSearch;