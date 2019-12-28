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

    constructor(hashtags, resultCount, config, parse) {
        this.hashtags = hashtags;
        this.resultCount = resultCount;
        this.config = config;
        this.twitterClient = new Twitter(config);
        this.exporter = parse; // Module to export data to csv.

        this.searchApiEndpoint = 'search/tweets'; // Query is appended later.
        this.countPerPage = 100;     // Number of tweets per page (maximum 100).
        this.maxID = 0; // Used in pagination.
    }

    // Makes a series of calls to the Twitter Search API to get the JSON
    // representation of the number of Tweets given by this.resultCount.
    // After each call, the raw data from Twitter is parsed and appended to a
    // .csv file.
    async getJsonArray(hashtag) {
        var countCollected = 0;
        var maxID = 0;

        console.log(`Calling the Twitter API`);

        this.twitterClient.get(this.searchApiEndpoint, {q: hashtag,
                count: this.countPerPage}, (error, tweets, response) => {
            if (error) {
                console.log(error);
            }
            
            this.parseJsonArray(tweets.statuses, (data) => {
                this.exporter.write(data);
            });

            var nextMaxID = tweets.search_metadata.next_results.split("&")[0];
            maxID = nextMaxID.split("=")[1];
            
            countCollected += tweets.search_metadata.count;
            console.log(countCollected + " results processed");

            this.getMoreResults(hashtag, maxID, countCollected);
        });
    }

    // Function that calls the Twitter Search API based on the results of the
    // prior call (to get the next sequential batch of results) and sends the
    // results to be parsed and appended to the .csv file.
    // If the number of tweets collected equals the resultCount, the function
    // returns without doing anything. 
    getMoreResults(hashtag, maxID, countCollected) {
        if (countCollected >= this.resultCount) {
            console.log("Ending recursive calls");
            return;
        }

        this.twitterClient.get(this.searchApiEndpoint, {q: hashtag,
                count: this.countPerPage, max_id: maxID}, 
                (error, tweets, response) => {
            if (error) {
                console.log(error);
            }

            this.parseJsonArray(tweets.statuses, (data) => {
                this.exporter.write(data);
            });

            var nextMaxID = tweets.search_metadata.next_results.split("&")[0];
            maxID = nextMaxID.split("=")[1];
            
            countCollected += tweets.search_metadata.count;
            console.log(countCollected + " results processed");

            this.getMoreResults(hashtag, maxID, countCollected);
        });
    }

    // Takes an array of JSON objects (representing Tweets), and returns a new
    // array of JSON objects where each object corresponds to a Tweet, and
    // contains the Twitter handle of the source, the number of followers of
    // that handle, the number of accounts that handle is following, and
    // whether the Tweet in question is a retweet.
    parseJsonArray(tweets, callback) {
        var tweetData = [];

        console.log(`Parsing search results`);

        tweets.forEach((tweet) => {
            var dataObject = {
                "handle": tweet.user.screen_name,
                "followers": tweet.user.followers_count,
                "following": tweet.user.friends_count,
                "retweet": tweet.retweeted
            };  // TODO: Add following count
            tweetData.push(dataObject);
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
    async getResultsAsJson() {
        for (var i = 0; i < this.hashtags.length; i++) {
            console.log(`Searching for '${this.hashtags[i]}'`);
            this.getJsonArray(this.hashtags[i]);
        }
    }

}

module.exports = HashtagSearch;