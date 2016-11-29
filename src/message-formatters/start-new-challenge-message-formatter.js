function format() {
  return {
    text: "Type `/start` to start a new challenge",
    options: {
      parse_mode: 'Markdown'
    }
  };
}

export default {
  format: format
};