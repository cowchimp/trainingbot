# trainingbot

A [Telegram](https://telegram.org) quiz chatbot to help you train and level-up your knowledge

![Screenshot](/example-screenshot.gif?raw=true)

## Getting started

1. Run `npm install`
2. Run `npm run-script build` (runs Babel)
3. Set these environment variables
  1. `telegramToken` (e.g. 123456789:AbC0dEf1GhI2jKl3M-nO4pQr5StU6vWx7Yz)
  2. `mongoUrl` (e.g localhost:27017/trainingbot)
4. The bot uses [MongoDB](https://www.mongodb.com/) for persistence.
  1. Create a `challenges` collection.
  2. Add at least one challenge document according to the format in `example-challenge-document.json`
5. Run `npm start`

## Running tests

Run mocha tests with `npm test`

## License

MIT