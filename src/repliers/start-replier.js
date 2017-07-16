const repository = require('../repository');

async function reply({userId, text}) {
  if(text != '/start') {
    return null;
  }

  var challenges = await repository.getChallenges();
  if(!challenges.length) {
    return { text: "No available challenges. Check again tomorrow!"};
  }
  challenges = challenges.map(x => x.title);

  return {
    text: 'Welcome! Choose your challenge',
    options: {
      reply_markup: {
        keyboard: [
          challenges.map(x => ({ text: x }))
        ],
        resize_keyboard: true,
        one_time_keyboard: true
      }
    }
  };
}

exports.reply = reply;
