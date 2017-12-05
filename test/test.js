const assert = require('assert');
const swearjar = require('../src/index');


describe('swearjar.isSubstringProfane', () => {
  it('should should detect bad words within a string', () => {
    assert.equal(swearjar.isSubstringProfane('i love you john doe'), false);
    assert.equal(swearjar.isSubstringProfane('fuckyoujohndoe'), true);
  });

  it('should detect uppercase bad words within a string', () => {
    assert.equal(swearjar.isSubstringProfane('FUCKyoujohndoe'), true);
  });

  it('should detect mixedcase bad words within a string', () => {
    assert.equal(swearjar.isSubstringProfane('FuCkyoujohndoe'), true);
  });

  it('should work with large strings', () => {
    assert.equal(swearjar.isSubstringProfane('In the spirit of omotenashi, please enjoy 79% off on all Kamikoto Knives. Enter code during checkout. FuCkyoujohndoe. Limited time offer.'), true); // eslint-disable-line max-len
  });
});


describe('swearjar.profane', () => {
  it('should should detect bad words', () => {
    assert.equal(swearjar.profane('i love you john doe'), false);
    assert.equal(swearjar.profane('fuck you john doe'), true);
  });

  it('should detect uppercase bad words', () => {
    assert.equal(swearjar.profane('FUCK you john doe'), true);
  });

  it('should detect mixedcase bad words', () => {
    assert.equal(swearjar.profane('FuCk you john doe'), true);
  });
});


describe('swearjar.censor', () => {
  it('should remove bad words', () => {
    assert.equal(swearjar.censor('fuck you john doe bitch'), '**** you john doe *****');
  });

  it('should handle edgecases', () => {
    assert.equal(swearjar.censor("Assasin's Creed Ass"), "Assasin's Creed ***");
    assert.equal(swearjar.censor("Assasin's Creed\nAss"), "Assasin's Creed\n***");
  });
});


describe('swearjar.scorecard', () => {
  it('should count bad words and categorize them', () => {
    assert.deepEqual(swearjar.scorecard('fuck you john doe'), {
      sexual: 1,
    });

    assert.deepEqual(swearjar.scorecard('fuck you john doe bitch fuck'), {
      sexual: 2,
      insult: 1,
    });
  });
});
