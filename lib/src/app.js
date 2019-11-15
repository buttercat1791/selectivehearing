/**
 * @file app.js
 * 
 * Entry and exit point for selectivehearing script.
 * Pulls 100,000 Tweets associated with specified hashtag and exports them to
 * a .csv file.
 */

import * as config from "lib/config/config.js";
import "twitter";

// Array of hashtags to be used in the search.  Modify as needed.
const hashtags = [`SXSW`];

var TwitterBot = new TwitterBot(config);

