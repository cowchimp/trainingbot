const repository = require('../repository');
const questionMessageFormatter = require('../message-formatters/question-message-formatter');

async function reply({userId, text}) {
  if(!text) {
    return null;
  }

  var challenge = await repository.getChallengeByTitle(text);
  if(!challenge) {
    return null;
  }

  await repository.setActiveChallenge(userId, challenge._id);

  var introMessage = {
    text: challenge.description,
    options: {
      parse_mode: 'Markdown'
    }
  };

  var firstQuestion = challenge.questions[0];
  var questionMessage = questionMessageFormatter.format(firstQuestion);

  return [ introMessage, questionMessage ];
}

exports.reply = reply;
