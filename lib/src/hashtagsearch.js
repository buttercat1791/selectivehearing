/**
 * @file hashtagsearch.js
 * 
 * Contains class that searches Twitter for given hashtags, and returns a
 * specified number of Tweets from each hashtag.
 */

import * as Twitter from "twitter";

class HashtagSearch {

    HashtagSearch(hashtags, resultCount, config) {
        this.hashtags = hashtags;
        this.resultCount = resultCount;
        this.config = config;
        this.twitter = new Twitter(config);
    }

    getResultsAsJson() {
        // TODO: Add Twitter API call to retrieve Tweets
    }
}

export { HashtagSearch };