const startReplier = require('./repliers/start-replier');
const chooseChallengeReplier = require('./repliers/choose-challenge-replier');
const answerQuestionReplier = require('./repliers/answer-question-replier');
const startNewChallengeMessageFormatter = require('./message-formatters/start-new-challenge-message-formatter');
const chainProcessor = require('./chain-processor');

var repliers = [
  startReplier.reply,
  chooseChallengeReplier.reply,
  answerQuestionReplier.reply
];

async function reply(message) {
  try {
    var replies = await chainProcessor.processAsync(repliers, message);

    if(!replies) {
      replies = startNewChallengeMessageFormatter.format();
    }

    if(!Array.isArray(replies)) {
      replies = [ replies ];
    }

    replies = replies.map(reply => {
      if(typeof reply == 'string' && reply.length > 0) {
        return {
          text: reply,
          options: {}
        };
      }

      return reply;
    });

    return replies;
  } catch(ex) {
    console.error(ex);
    return 'An error occurred when calculating the reply';
  }
}

exports.reply = reply;
