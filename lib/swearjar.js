// swearjar-node
var path = require('path');
var swearjar = {

  _badWords: {},

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

  loadBadWords: function (relativePath) {
    var basePath = path.dirname(module.parent.filename);
    var fullPath = path.join(basePath, relativePath);
    this._badWords = require(fullPath);
  },
  
  setBadWords: function (badWords) {
    this._badWords = badWords || {};
  }
};

swearjar._badWords = require("./config/en_US.json");

module.exports = swearjar;
