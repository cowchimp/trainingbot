const repository = require('../repository');
const questionMessageFormatter = require('../message-formatters/question-message-formatter');
const startNewChallengeMessageFormatter = require('../message-formatters/start-new-challenge-message-formatter');

async function reply({userId, text}) {
  if(!text) {
    return null;
  }

  var player = await repository.getPlayer(userId);
  if(!player || !player.activeChallenge) {
    return null;
  }

  var challenge = await repository.getChallengeById(player.activeChallenge);
  if(!challenge) {
    return null;
  }

  var question = challenge.questions[player.questionIndex];
  let chosenAnswerIndex = question.answers.indexOf(text);
  if(chosenAnswerIndex < 0) {
    let feedbackMessage = "That's not a valid answer for the question- try again";
    let questionMessage = questionMessageFormatter.format(question);
    return [ feedbackMessage, questionMessage ];
  }

  var isCorrectAnswer = chosenAnswerIndex == question.correctAnswerIndex;
  var feedbackMessage = getValidAnswerFeedbackMessage(isCorrectAnswer, question);

  if(player.questionIndex < challenge.questions.length - 1) {
    await repository.advanceToNextQuestion(userId, isCorrectAnswer);
    let questionMessage = questionMessageFormatter.format(challenge.questions[++player.questionIndex]);
    return [ feedbackMessage, questionMessage ];
  }

  var correctQuestionCount = (player.correctQuestionCount || 0)  + (isCorrectAnswer ? 1 : 0);
  var statsMessage = getStatsMessage(challenge, correctQuestionCount);
  var startNewChallengeMessage = startNewChallengeMessageFormatter.format();
  await repository.setActiveChallenge(userId, null);
  return [ feedbackMessage, statsMessage, startNewChallengeMessage ];
}

exports.reply = reply;

function getValidAnswerFeedbackMessage(isCorrectAnswer, question) {
  var responseText = isCorrectAnswer ? "That's correct! \u{1F44D}" : ["That's wrong \u{1F44E}", 'The correct answer is:', question.answers[question.correctAnswerIndex]].join('\n');

  return {
    text: responseText,
    options: { parse_mode: 'Markdown' }
  };
}

function getStatsMessage(challenge, correctQuestionCount) {
  return {
    text: `You've completed "${challenge.title}"  \nYou've answered *${correctQuestionCount}* out of *${challenge.questions.length}* questions correctly`,
    options: { parse_mode: 'Markdown' }
  };
}