var assert = require('assert');
var swearjar = require('../lib/swearjar.js');

describe('swearjar.profane', function () {

  it('should should detect bad words', function () {
    assert.equal(swearjar.profane('i love you john doe'), false);
    assert.equal(swearjar.profane('fuck you john doe'), true);
  });

  it('should detect uppercase bad words', function () {
    assert.equal(swearjar.profane('FUCK you john doe'), true);
  });

  it('should detect mixedcase bad words', function () {
    assert.equal(swearjar.profane('FuCk you john doe'), true);
  });

});

describe('swearjar.censor', function () {

  it('should remove bad words', function () {
    assert.equal(swearjar.censor('fuck you john doe bitch'), "**** you john doe *****");
  });

});

describe('swearjar.scorecard', function () {

  it('should count bad words and categorize them', function () {
    assert.deepEqual(swearjar.scorecard('fuck you john doe'), {
      sexual: 1
    });

    assert.deepEqual(swearjar.scorecard('fuck you john doe bitch fuck'), {
      sexual: 2,
      insult: 1
    });
  });

});
