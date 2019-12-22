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
        this.maxID = 0; // Used in pagination.
    }

    // Makes a series of calls to the Twitter Search API to get the JSON
    // representation of the number of Tweets given by this.resultCount.
    // Each API call returns a maximum of 100 Tweets, so this function uses
    // pagination and some additional parameters to get older Tweets.
    async getJsonArray(hashtag, callback) {
        var countCollected = 0;

        this.getTweetsWithQuery(hashtag, (resultStatuses, id) => {
            this.maxID = id;
            countCollected += this.countPerPage;
            resultStatuses.push(this.getTweetsWithQueryForMaxID(hashtag,
                    this.maxID, countCollected));
            // The parameter has to be resultStatuses[0] because for some
            // reason, resultStatuses comes from getTweetsWithQuery as an array
            // of arrays. The 0th item is the array with the actual data; there
            // is a 1st item, but that is empty.
            this.parseJsonArray(resultStatuses[0], (data) => {
                callback(data);
            });
        });
    }

    // Calls the Twitter Search API and sends back the raw results in the
    // callback.
    getTweetsWithQuery(query, callback) {
        var resultStatuses = [];
        var newMaxID;

        this.twitterClient.get('search/tweets', 
                {q: query, count: this.countPerPage}, 
                (error, tweets, response) => {
            if (error) {
                console.log(error);
            }
            resultStatuses.push(tweets.statuses);
            newMaxID = resultStatuses[resultStatuses.length - 1].id;
            callback(resultStatuses, newMaxID);
        });
    }

    // Calls the Twitter Search API with a max_id paramater.  Used in
    // paginated searches.
    getTweetsWithQueryForMaxID(query, maxID, countCollected) {
        var newMaxID;
        var newCountCollected = countCollected;

        this.twitterClient.get('search/tweets', 
                {q: query, count: this.countPerPage, max_id: maxID}, 
                (error, tweets, response) => {
            if (error) {
                console.log(error);
            }
            newMaxID = tweets.statuses[this.countPerPage - 1].id;
            newCountCollected += this.countPerPage;
            if (countCollected >= this.resultCount) {
                return tweets.statuses;
            }
            return tweets.statuses.push(this.getTweetsWithQueryForMaxID(query,
                    newMaxID, newCountCollected));
        });
    }

    // Takes an array of JSON objects (representing Tweets), and returns a new
    // array of JSON objects where each object corresponds to a Tweet, and
    // contains the Twitter handle of the source, the number of followers of
    // that handle, the number of accounts that handle is following, and
    // whether the Tweet in question is a retweet.
    parseJsonArray(tweets, callback) {
        var tweetData = [];

        tweets.forEach((tweet, index) => {
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
    async getResultsAsJson(callback) {

        for (var i = 0; i < this.hashtags.length; i++) {
            this.getJsonArray(this.hashtags[i], (results) => {
                callback(results);
            });
        }
    }

}

module.exports = HashtagSearch;