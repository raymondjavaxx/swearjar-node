// swearjar-node

var swearjar = {

  _badWords: {},

  scan: function (text, callback) {
    var key;
    var words = text.match(/\w+/g);

    for (var i = 0; i < words.length; i+=1) {
      key = words[i].toLowerCase();

      if (key in this._badWords) {
        if (callback(words[i], this._badWords[key]) === false) {
          break;
        }
      }
    }
  },

  profane: function (text) {
    var profane = false;

    this.scan(text, function (word, categories) {
      profane = true;
      return false; // Stop on first match
    });

    return profane;
  },

  scorecard: function (text) {
    var scorecard = {};

    this.scan(text, function (word, categories) {
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

    this.scan(text, function (word, categories) {
      censored = censored.replace(word, word.replace(/\S/g, '*'));
    });

    return censored;
  },

  loadBadWords: function (path) {
    this._badWords = require(path);
  }
};

swearjar.loadBadWords("./config/en_US.json");

module.exports = swearjar;
