/**
 * @file jsontocsv.js
 * 
 * Contains class that accepts json arrays as input and exports them to a .csv
 * file.
 * 
 * Uses the json2csv package: https://www.npmjs.com/package/json2csv
 */

 var json2csv = require('json2csv');

class JsonToCsv {

    constructor(jsonTweets, outputFileName) {
        this.tweets = jsonTweets;   // Array of JSON objects.
        this.outputFile = outputFileName;
    }

    // Accepts an array of JSON objects as an argument and appends them to the
    // .csv file with the name given by outputFile.
    write(jsonObjects) {
        //console.log(jsonObjects);
    }

}

module.exports = JsonToCsv;