import startReplier from './repliers/start-replier';
import chooseChallengeReplier from './repliers/choose-challenge-replier';
import answerQuestionReplier from './repliers/answer-question-replier';
import startNewChallengeMessageFormatter from './message-formatters/start-new-challenge-message-formatter';
import chainProcessor from './chain-processor';

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

export default {
  reply: reply
}