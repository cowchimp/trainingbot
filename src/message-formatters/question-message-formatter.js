function format(question) {
  return {
    text: question.text,
    options: {
      parse_mode: 'Markdown',
      reply_markup: {
        keyboard: [
          question.answers.map(x => ({ text: x }))
        ],
        resize_keyboard: true,
        one_time_keyboard: true
      }
    }
  };
}

export default {
  format: format
};