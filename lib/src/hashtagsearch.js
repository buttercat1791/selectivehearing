/**
 * @file hashtagsearch.js
 * 
 * Contains class that searches Twitter for given hashtags, and returns a
 * specified number of Tweets from each hashtag.
 * 
 * Uses technique found in:
 * https://bhaskarvk.github.io/2015/01/how-to-use-twitters-search-rest-api-most-effectively./
 */

import * as Twitter from "twitter";

class HashtagSearch {

    searchApiEndpoint = "https://api.twitter.com/1.1/search/tweets.json"

    HashtagSearch(hashtags, resultCount, config) {
        this.hashtags = hashtags;
        this.resultCount = resultCount;
        this.config = config;
        this.twitter = new Twitter(config);
    }

    getResultsAsJson() {
        results = getJsonArray();
        exportData = parseJsonArray(results);
    }
}

export { HashtagSearch };