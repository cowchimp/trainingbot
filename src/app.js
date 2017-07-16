const TelegramBot = require('node-telegram-bot-api');
const config = require('./config');
const messageReplier = require('./message-replier');

var telegramToken = config.get('telegramToken');
if(typeof telegramToken != 'string' || !telegramToken.length) {
  throw new Error('Must pass `telegramToken` configuration');
}

var bot = new TelegramBot(telegramToken, { polling: { interval: 500 } });

bot.on('message', function (msg) {
  var chatId = msg.chat.id;
  handleMessage(chatId, msg.text);
});

async function handleMessage(chatId, text) {
  var replies = await messageReplier.reply({
    userId: chatId,
    text: text
  });

  var sendPromise = replies.reduce(function(promise, reply) {
    return promise.then(() => bot.sendMessage(chatId, reply.text, reply.options));
  }, Promise.resolve());

  try {
    await sendPromise;
  } catch(ex) {
    console.log(ex);
    try {
      bot.sendMessage(chatId, 'An error occurred when sending the reply');
    }
    catch(ex) {
      console.log(ex);
    }
  }
}