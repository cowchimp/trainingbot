const chai = require('chai');
const sinon = require('sinon');
const repository = require('../src/repository');
const answerQuestionReplier = require('../src/repliers/answer-question-replier');

chai.should();

describe('answerQuestionReplier', function() {
  beforeEach(function() {
    this.sinon = sinon.sandbox.create();

    this.sinon.stub(repository, 'getChallengeById').withArgs('1st-grade-math').returns({
      _id: '1st-grade-math',
      title: '1st Grade Math',
      questions: [
        { text: '1+1?', answers: ['0', '1', '2'], correctAnswerIndex: 2 },
        { text: '1x1?', answers: ['0', '1', '2'], correctAnswerIndex: 1 }
      ]
    });

    this.sinon.stub(repository, 'advanceToNextQuestion');
    this.sinon.stub(repository, 'setActiveChallenge');
  });
  afterEach(function() {
    this.sinon.restore();
  });

  describe('reply', function() {
    it('should reply that the answer is invalid and repeat the question when the answer is invalid', async function() {
      this.sinon.stub(repository, 'getPlayer').withArgs(1).returns({ activeChallenge: '1st-grade-math', questionIndex: 0 });
      var expected = [ "That's not a valid answer for the question- try again", {
        text: "1+1?",
        options: {
          parse_mode: 'Markdown',
          reply_markup: {
            keyboard: [
              [ { text: '0' }, { text: '1' }, { text: '2' } ]
            ],
            resize_keyboard: true,
            one_time_keyboard: true
          }
        }
      } ];

      var result = await answerQuestionReplier.reply({ userId: 1, text: '4'});

      return result.should.deep.equal(expected);
    });

    it('should reply "That\'s correct!" and send the next question when the answer is correct', async function() {
      this.sinon.stub(repository, 'getPlayer').withArgs(1).returns({ activeChallenge: '1st-grade-math', questionIndex: 0 });
      var expected = [ {
          text: "That's correct! \u{1F44D}",
          options: { parse_mode: "Markdown" }
        }, {
          text: "1x1?",
          options: {
            parse_mode: "Markdown",
            reply_markup: {
              keyboard: [ [ { text: "0" }, { text: "1" }, { text: "2" } ] ],
              resize_keyboard: true,
              one_time_keyboard: true
            }
          }
        }
      ];

      var result = await answerQuestionReplier.reply({ userId: 1, text: '2'});

      return result.should.deep.equal(expected);
    });

    it('should reply "That\'s correct!" and send the challenge stats when the question is the last one and the answer is correct', async function() {
      this.sinon.stub(repository, 'getPlayer').withArgs(1).returns({ activeChallenge: '1st-grade-math', questionIndex: 1, correctQuestionCount: 1 });
      var expected = [ {
        text: "That's correct! \u{1F44D}",
        options: { parse_mode: "Markdown" }
      }, {
        text: "You've completed \"1st Grade Math\"  \nYou've answered *2* out of *2* questions correctly",
        options: { parse_mode: "Markdown" }
      }, {
        text: "Type `/start` to start a new challenge",
        options: { parse_mode: "Markdown" }
      }
      ];

      var result = await answerQuestionReplier.reply({ userId: 1, text: '1'});

      return result.should.deep.equal(expected);
    });

    it('should reply "That\'s wrong, the correct answer is..." and send the next question when the answer is wrong', async function() {
      this.sinon.stub(repository, 'getPlayer').withArgs(1).returns({ activeChallenge: '1st-grade-math', questionIndex: 0 });
      var expected = [ {
        text: "That's wrong \u{1F44E}\nThe correct answer is:\n2",
        options: { parse_mode: "Markdown" }
      }, {
        text: "1x1?",
        options: {
          parse_mode: "Markdown",
          reply_markup: {
            keyboard: [ [ { text: "0" }, { text: "1" }, { text: "2" } ] ],
            resize_keyboard: true,
            one_time_keyboard: true
          }
        }
      }
      ];

      var result = await answerQuestionReplier.reply({ userId: 1, text: '1'});

      return result.should.deep.equal(expected);
    });

    it('should reply "That\'s wrong, the correct answer is..." and send the challenge stats when the question is the last one and the answer is wrong', async function() {
      this.sinon.stub(repository, 'getPlayer').withArgs(1).returns({ activeChallenge: '1st-grade-math', questionIndex: 1 });
      var expected = [ {
        text: "That's wrong \u{1F44E}\nThe correct answer is:\n1",
        options: { parse_mode: "Markdown" }
      }, {
        text: "You've completed \"1st Grade Math\"  \nYou've answered *0* out of *2* questions correctly",
        options: { parse_mode: "Markdown" }
      }, {
        text: "Type `/start` to start a new challenge",
        options: { parse_mode: "Markdown" }
      }
      ];

      var result = await answerQuestionReplier.reply({ userId: 1, text: '2'});

      return result.should.deep.equal(expected);
    });
  });
});