const BAD_WORDS = require('./config/en_US.json');

const WORD_SEP_REGEX = /\s+/;


/**
 * Scan the text for a bad word
 */
function scan(text, callback) {
  const regex = /\w+/g;
  for (;;) {
    const match = regex.exec(text);
    if (!match) {
      break;
    }

    const word = match[0];
    const key = word.toLowerCase();

    if (key in BAD_WORDS && Array.isArray(BAD_WORDS[key])) {
      if (callback(word, match.index, BAD_WORDS[key]) === false) {
        break;
      }
    }
  }
}


/**
 * Only checks if a whole word within string is profane
 */
function profane(text) {
  let isProfane = false;
  scan(text, () => {
    isProfane = true;
    return false; // Stop on first match
  });

  return isProfane;
}


/**
 * Scorecard
 */
function scorecard(text) {
  const scorecardCats = {};
  scan(text, (word, index, categories) => {
    for (let i = 0; i < categories.length; i += 1) {
      const cat = categories[i];
      if (cat in scorecardCats) {
        scorecardCats[cat] += 1;
      } else {
        scorecardCats[cat] = 1;
      }
    }
  });

  return scorecardCats;
}


/**
 * Censor
 */
function censor(text) {
  let censored = text;
  scan(text, (word, index) => {
    censored = censored.substr(0, index) + word.replace(/\S/g, '*') + censored.substr(index + word.length);
  });

  return censored;
}


/**
 * Checks each substring (starting at length of 3 by default) within a string for profanity
 * Use regex and .test against each word in en_US.json for very large strings instead
 * Use an iterative algorithm as the recursive version can run out of stack space
 */
function isSubstringProfane(text, start = 0, minPartialLength = 3) {
  if (typeof text !== 'string') {
    return false;
  }

  const words = text.split(WORD_SEP_REGEX);
  for (let wordIdx = 0; wordIdx < words.length; wordIdx += 1) {
    const word = words[wordIdx].trim().toLowerCase();
    for (let partialLength = minPartialLength; partialLength <= text.length; partialLength += 1) {
      const maxStart = text.length - partialLength;
      for (let curStart = start; curStart <= maxStart; curStart += 1) {
        const partialWord = word.slice(curStart, curStart + partialLength);
        if (profane(partialWord)) {
          return true;
        }
      }
    }
  }

  return false;
}


module.exports = {
  scan,
  profane,
  scorecard,
  censor,
  isSubstringProfane,
};
