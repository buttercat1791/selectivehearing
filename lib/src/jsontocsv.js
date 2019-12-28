/**
 * @file jsontocsv.js
 * 
 * Contains class that accepts json arrays as input and exports them to a .csv
 * file.
 * 
 * Uses the json2csv package: https://www.npmjs.com/package/json2csv
 */

var fs = require('fs');
var Parser = require('json2csv');

class JsonToCsv {

    constructor(outputFileName) {
        this.outputFile = outputFileName + '.csv';

        fs.writeFileSync(this.outputFile, "");

        // Determined by project specifications.
        var fields = ['handle', 'followers', 'following', 'retweet'];
        
        this.opts = { fields };
    }

    // Accepts an array of JSON objects as an argument and appends them to the
    // .csv file with the name given by outputFile.
    write(jsonObjects) {
        var csv = Parser.parse(jsonObjects, this.opts);

        fs.appendFile(this.outputFile, csv, () => {
            console.log(this.outputFile + " updated");
        });
    }

}

module.exports = JsonToCsv;