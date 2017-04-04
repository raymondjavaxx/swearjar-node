// swearjar-node

var swearjar = {

  _badWords: {},

  // Checks each substring (starting at length of 3 by default) within a string for profanity
  // Use regex and .test against each word in en_US.json for very large strings instead
  isSubstringProfane(text, start = 0, partialLength = 3) {
    if (typeof text !== 'string') return false;
    if (text.length <= partialLength) return this.profane(text);
    const partialText = text.slice(start, start + partialLength);
    if (this.profane(partialText)) {
      return true;
    } else {
      if(partialLength !== text.length) {
        if (start !== text.length - partialLength) {
          return this.isSubstringProfane(text, ++start, partialLength);
        } else {
          return this.isSubstringProfane(text, 0, ++partialLength)
        }
      }
    }
    return false;
  },

  scan: function (text, callback) {
    var word, key, match;
    var regex = /\w+/g

    while (match = regex.exec(text)) {
      word = match[0];
      key  = word.toLowerCase();

      if (key in this._badWords && Array.isArray(this._badWords[key])) {
        if (callback(word, match.index, this._badWords[key]) === false) {
          break;
        }
      }
    }
  },

  // Only checks if a whole word within string is profane
  profane: function (text) {
    var profane = false;

    this.scan(text, function (word, index, categories) {
      profane = true;
      return false; // Stop on first match
    });

    return profane;
  },

  scorecard: function (text) {
    var scorecard = {};

    this.scan(text, function (word, index, categories) {
      for (var i = 0; i < categories.length; i+=1) {
        var cat = categories[i];

        if (cat in scorecard) {
          scorecard[cat] += 1;
        } else {
          scorecard[cat] = 1;
        }
      };
    });

    return scorecard;
  },

  censor: function (text) {
    var censored = text;

    this.scan(text, function (word, index, categories) {
      censored = censored.substr(0, index) +
                  word.replace(/\S/g, '*') +
                  censored.substr(index + word.length);
    });

    return censored;
  },

  loadBadWords: function (path) {
    this._badWords = require(path);
  }
};

swearjar.loadBadWords("./config/en_US.json");

module.exports = swearjar;
